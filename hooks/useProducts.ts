import { useCallback, useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database } from '@/database';
import Product from '@/database/models/Product';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type UseProductsOptions = {
    companyId?: string;
    search?: string;
    category?: string;
    filter?: 'all' | 'low' | 'out';
    sortBy?: 'az' | 'za' | 'qty_asc' | 'qty_desc' | 'value_desc' | 'value_asc';
};

const LOW_STOCK_THRESHOLD = 5;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts({
    companyId = '',
    search = '',
    category = 'all',
    filter = 'all',
    sortBy = 'az',
}: UseProductsOptions) {

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refetch = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    useEffect(() => {

        setIsLoading(true);
        setError(null);

        const collection = database.get<Product>('products');

        // ── Query base ──
        const conditions = [
            Q.where('is_deleted', Q.notEq(true)),
        ];

        // ── Empresa ──
        if (companyId) {
            conditions.push(Q.where('company_id', companyId));
        }

        // ── Categoria ──
        if (category !== 'all') {
            conditions.push(Q.where('category', category));
        }

        // ── Filtro de estoque ──
        if (filter === 'out') {
            conditions.push(Q.where('quantity', 0));
        }

        if (filter === 'low') {
            conditions.push(Q.where('quantity', Q.gt(0)));
            conditions.push(Q.where('quantity', Q.lte(LOW_STOCK_THRESHOLD)));
        }

        const subscription = collection
            .query(...conditions)
            .observe()
            .subscribe({
                next: (results) => {

                    let filtered = results;

                    // ── Busca ──
                    if (search.trim()) {

                        const q = search.toLowerCase();

                        filtered = filtered.filter((p) =>
                            p.name.toLowerCase().includes(q) ||
                            (p.eanCode ?? '').toLowerCase().includes(q)
                        );
                    }

                    // ── Ordenação ──
                    filtered = [...filtered].sort((a, b) => {

                        switch (sortBy) {

                            case 'az':
                                return a.name.localeCompare(b.name);

                            case 'za':
                                return b.name.localeCompare(a.name);

                            case 'qty_asc':
                                return a.quantity - b.quantity;

                            case 'qty_desc':
                                return b.quantity - a.quantity;

                            case 'value_asc':
                                return a.value - b.value;

                            case 'value_desc':
                                return b.value - a.value;

                            default:
                                return 0;
                        }
                    });

                    setProducts(filtered);
                    setIsLoading(false);
                },

                error: (err) => {
                    console.log(err);

                    setError(err.message);
                    setIsLoading(false);
                },
            });

        return () => subscription.unsubscribe();

    }, [companyId, search, category, filter, sortBy, refreshKey]);

    // ── Contadores ──

    const outCount = products.filter(
        (p) => p.quantity === 0
    ).length;

    const lowCount = products.filter(
        (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD
    ).length;

    return {
        products,
        isLoading,
        error,
        outCount,
        lowCount,
        refetch,
    };
}