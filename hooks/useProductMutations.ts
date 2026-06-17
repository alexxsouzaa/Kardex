import { database } from '@/database';
import Product from '@/database/models/Product';
import { usePlan } from '@/hooks/usePlan';
import { persistImages } from '@/utils/persistImage';
import { useState } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ProductInput = {
    name: string;
    eanCode?: string;
    lote?: string;
    quantity: number;
    unit?: string;
    packaging?: string;
    value: number;
    expiryDate?: string;
    category?: string;
    type?: string;
    brand?: string;
    supplier?: string;
    images?: string[];
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductMutations() {
    const { check, limits } = usePlan();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Criar produto ──
    const createProduct = async (
        input: ProductInput
    ): Promise<Product | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const collection = database.get<Product>('products');

            const currentCount = await collection.query().fetchCount();

            // ── Verifica limite do plano ──
           if (check && !check('maxProducts', currentCount)) {
                setError('Limite de produtos atingido');
                return null;
            }

            // Persiste imagens do cache para diretório permanente
            const persistedImages = await persistImages(
                input.images?.slice(0, limits?.maxPhotos ?? 10) ?? []
            );

            let newProduct!: Product;

            await database.write(async () => {
                newProduct = await collection.create((p) => {
                    // ── Dados principais ──
                    p.companyId = 'offline-company';

                    p.name = input.name;
                    p.eanCode = input.eanCode ?? null;
                    p.lote = input.lote ?? null;

                    // ── Quantidade ──
                    p.quantity = input.quantity;
                    p.unit = input.unit ?? null;
                    p.packaging = input.packaging ?? 'unidade';

                    // ── Valores ──
                    p.value = input.value;
                    p.expiryDate = input.expiryDate ?? null;

                    // ── Categoria ──
                    p.category = input.category ?? null;
                    p.type = input.type ?? null;
                    p.brand = input.brand ?? null;
                    p.supplier = input.supplier ?? null;

                    // ── Imagens (persistidas antes de salvar) ──
                    // As imagens já foram persistidas antes de entrar aqui
                    p.imagesRaw = JSON.stringify(
                       (persistedImages ?? []).slice(0, limits?.maxPhotos ?? 10)
                    );

                    // ── Offline ──
                    p.createdBy = 'offline-user';
                    p.isDeleted = false;
                });
            });

            return newProduct;

        } catch (err: any) {
            console.log(err);

            setError(
                err?.message || 'Erro ao cadastrar produto'
            );

            return null;

        } finally {
            setIsLoading(false);
        }
    };

    // ── Atualizar produto ──
    const updateProduct = async (
        product: Product,
        input: Partial<ProductInput>
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            // Persiste imagens do cache para diretório permanente
            let persistedEditImages: string[] | undefined;
            if (input.images !== undefined) {
                persistedEditImages = await persistImages(
                    input.images.slice(0, limits?.maxPhotos ?? 10)
                );
            }

            await database.write(async () => {
                await product.update((p) => {
                    if (input.name !== undefined)
                        p.name = input.name;

                    if (input.eanCode !== undefined)
                        p.eanCode = input.eanCode ?? null;

                    if (input.lote !== undefined)
                        p.lote = input.lote ?? null;

                    if (input.quantity !== undefined)
                        p.quantity = input.quantity;

                    if (input.unit !== undefined)
                        p.unit = input.unit ?? null;

                    if (input.packaging !== undefined)
                        p.packaging = input.packaging;

                    if (input.value !== undefined)
                        p.value = input.value;

                    if (input.expiryDate !== undefined)
                        p.expiryDate = input.expiryDate ?? null;

                    if (input.category !== undefined)
                        p.category = input.category ?? null;

                    if (input.type !== undefined)
                        p.type = input.type ?? null;

                    if (input.brand !== undefined)
                        p.brand = input.brand ?? null;

                    if (input.supplier !== undefined)
                        p.supplier = input.supplier ?? null;

                    if (input.images !== undefined) {
                        p.imagesRaw = JSON.stringify(persistedEditImages!);
                    }
                });
            });

            return true;

        } catch (err: any) {
            console.log(err);

            setError(
                err?.message || 'Erro ao atualizar produto'
            );

            return false;

        } finally {
            setIsLoading(false);
        }
    };

    // ── Soft delete ──
    const deleteProduct = async (
        product: Product
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await database.write(async () => {
                await product.update((p) => {
                    p.isDeleted = true;
                });
            });

            return true;

        } catch (err: any) {
            console.log(err);

            setError(
                err?.message || 'Erro ao deletar produto'
            );

            return false;

        } finally {
            setIsLoading(false);
        }
    };

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        isLoading,
        error,
    };
}