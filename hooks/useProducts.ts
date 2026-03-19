import { useEffect, useState } from 'react';
import { Q }                   from '@nozbe/watermelondb';
import { database }            from '@/database';
import Product                 from '@/database/models/Product';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type UseProductsOptions = {
    companyId:  string;
    search?:    string;
    category?:  string;
    filter?:    'all' | 'low' | 'out';
    sortBy?:    'az' | 'za' | 'qty_asc' | 'qty_desc' | 'value_desc' | 'value_asc';
};

const LOW_STOCK_THRESHOLD = 5;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts({
    companyId,
    search    = '',
    category  = 'all',
    filter    = 'all',
    sortBy    = 'az',
}: UseProductsOptions) {
    const [products,  setProducts]  = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error,     setError]     = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) return;

        setIsLoading(true);
        setError(null);

        // Monta query base
        const conditions = [
            Q.where('company_id', companyId),
            Q.where('is_deleted', Q.notEq(true)),
        ];

        // Filtro de categoria
        if (category !== 'all') {
            conditions.push(Q.where('category', category));
        }

        // Filtro de estoque
        if (filter === 'out') {
            conditions.push(Q.where('quantity', Q.eq(0)));
        } else if (filter === 'low') {
            conditions.push(Q.where('quantity', Q.gt(0)));
            conditions.push(Q.where('quantity', Q.lte(LOW_STOCK_THRESHOLD)));
        }

        const subscription = database.get<Product>('products')
            .query(...conditions)
            .observe()
            .subscribe({
                next: (results) => {
                    let filtered = results;

                    // Busca por texto (client-side)
                    if (search.trim()) {
                        const q = search.toLowerCase();
                        filtered = results.filter(p =>
                            p.name.toLowerCase().includes(q)     ||
                            (p.eanCode ?? '').toLowerCase().includes(q) ||
                            p.id.toLowerCase().includes(q)
                        );
                    }

                    // Ordenação
                    filtered = [...filtered].sort((a, b) => {
                        switch (sortBy) {
                            case 'az':         return a.name.localeCompare(b.name);
                            case 'za':         return b.name.localeCompare(a.name);
                            case 'qty_asc':    return a.quantity - b.quantity;
                            case 'qty_desc':   return b.quantity - a.quantity;
                            case 'value_desc': return b.value - a.value;
                            case 'value_asc':  return a.value - b.value;
                            default:           return 0;
                        }
                    });

                    setProducts(filtered);
                    setIsLoading(false);
                },
                error: (err) => {
                    setError(err.message);
                    setIsLoading(false);
                },
            });

        return () => subscription.unsubscribe();
    }, [companyId, search, category, filter, sortBy]);

    // Contagens para o StockSummary
    const outCount = products.filter(p => p.quantity === 0).length;
    const lowCount = products.filter(p => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD).length;

    return { products, isLoading, error, outCount, lowCount };
}