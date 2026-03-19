import { useEffect, useState } from 'react';
import { database } from '@/database';
import Product from '@/database/models/Product';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProduct(productId: string) {
    const [product,   setProduct]   = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error,     setError]     = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;

        setIsLoading(true);

        const subscription = database.get<Product>('products')
            .findAndObserve(productId)
            .subscribe({
                next: (p) => {
                    setProduct(p);
                    setIsLoading(false);
                },
                error: (err) => {
                    setError(err.message);
                    setIsLoading(false);
                },
            });

        return () => subscription.unsubscribe();
    }, [productId]);

    return { product, isLoading, error };
}