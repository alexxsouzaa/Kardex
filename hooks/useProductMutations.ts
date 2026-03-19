import { database } from '@/database';
import Product                          from '@/database/models/Product';
import { useAuth }                      from '@/context/AuthContext';
import { usePlan }                      from '@/hooks/usePlan';
import { useState }                     from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ProductInput = {
    name:        string;
    eanCode?:    string;
    lote?:       string;
    quantity:    number;
    unit?:       string;
    packaging?:  string;
    value:       number;
    expiryDate?: string;
    category?:   string;
    type?:       string;
    brand?:      string;
    supplier?:   string;
    images?:     string[];
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductMutations() {
    const { user, company }  = useAuth();
    const { check, limits }  = usePlan();
    const [isLoading, setIsLoading] = useState(false);
    const [error,     setError]     = useState<string | null>(null);


    // ── Criar produto ──
    const createProduct = async (input: ProductInput): Promise<Product | null> => {
    if (!company || !user) {
        setError('Usuário não autenticado');
        return null;
    }

    setIsLoading(true);
    setError(null);

    try {
        const collection = database.get<Product>('products'); // ✅ aqui

        const currentCount = await collection.query().fetchCount();

        if (!check('maxProducts', currentCount)) return null;

        let newProduct!: Product;

        await database.write(async () => {
            newProduct = await collection.create((p) => {
                p.companyId = company.id;
                p.name = input.name;
                p.quantity = input.quantity;
                p.value = input.value;
                p.imagesRaw = JSON.stringify(input.images ?? []);
                p.createdBy = user.id;
                p.isDeleted = false;
            });
        });

        return newProduct;

    } catch (err: any) {
        setError(err.message);
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
            await database.write(async () => {
                await product.update((p) => {
                    if (input.name        !== undefined) p.name       = input.name;
                    if (input.eanCode     !== undefined) p.eanCode    = input.eanCode    ?? null;
                    if (input.lote        !== undefined) p.lote       = input.lote       ?? null;
                    if (input.quantity    !== undefined) p.quantity   = input.quantity;
                    if (input.unit        !== undefined) p.unit       = input.unit       ?? null;
                    if (input.packaging   !== undefined) p.packaging  = input.packaging  ?? null;
                    if (input.value       !== undefined) p.value      = input.value;
                    if (input.expiryDate  !== undefined) p.expiryDate = input.expiryDate ?? null;
                    if (input.category    !== undefined) p.category   = input.category   ?? null;
                    if (input.type        !== undefined) p.type       = input.type       ?? null;
                    if (input.brand       !== undefined) p.brand      = input.brand      ?? null;
                    if (input.supplier    !== undefined) p.supplier   = input.supplier   ?? null;
                    if (input.images      !== undefined) {
                        const imgs = input.images.slice(0, limits.maxPhotos);
                        p._imagesRaw = JSON.stringify(imgs);
                    }
                });
            });
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // ── Soft delete ──
    const deleteProduct = async (product: Product): Promise<boolean> => {
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
            setError(err.message);
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