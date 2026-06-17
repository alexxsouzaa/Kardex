import * as FileSystem from 'expo-file-system/legacy';

/**
 * Diretório permanente para imagens de produtos.
 */
const IMAGES_DIR = `${FileSystem.documentDirectory}product-images/`;

/**
 * Garante que o diretório de imagens existe.
 */
async function ensureDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    }
}

/**
 * Copia uma imagem temporária (cache) para o diretório permanente
 * do app e retorna a nova URI.
 *
 * Se a imagem já estiver no diretório permanente, retorna a URI original.
 */
export async function persistImage(uri: string): Promise<string> {
    if (!uri?.trim()) return uri;

    // Se já está no diretório permanente, não precisa copiar
    if (uri.startsWith(IMAGES_DIR)) return uri;

    await ensureDir();

    const ext = uri.split('.').pop()?.split('?')[0] ?? 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const dest = `${IMAGES_DIR}${fileName}`;

    await FileSystem.copyAsync({ from: uri, to: dest });

    return dest;
}

/**
 * Persiste um array de URIs de imagens temporárias, retornando
 * o array com URIs permanentes.
 */
export async function persistImages(uris: string[]): Promise<string[]> {
    const results: string[] = [];

    for (const uri of uris) {
        if (!uri?.trim()) continue;
        try {
            const persisted = await persistImage(uri);
            results.push(persisted);
        } catch (err) {
            console.warn('[persistImages] Falha ao copiar imagem:', uri, err);
        }
    }

    return results;
}
