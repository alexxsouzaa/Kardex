import { database }   from '@/database';
import { Q }          from '@nozbe/watermelondb';
import Movement        from '@/database/models/Movement';
import Product         from '@/database/models/Product';
import { useApp }     from '@/context/AppContext';
import { useEffect, useState } from 'react';

export type MovementType = 'in' | 'out' | 'adjust';

export function useMovements(productId?: string) {
    const { user, company }           = useApp();
    const [movements,  setMovements]  = useState<Movement[]>([]);
    const [isLoading,  setIsLoading]  = useState(false);
    const [isSaving,   setIsSaving]   = useState(false);
    const [error,      setError]      = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;

        setIsLoading(true);

        // ← usa database.get em vez de collection importada
        const collection = database.get<Movement>('movements');

        const subscription = collection
            .query(
                Q.where('product_id', productId),
                Q.where('is_deleted', Q.notEq(true)),
                Q.sortBy('created_at', Q.desc),
            )
            .observe()
            .subscribe({
                next: (results) => {
                    setMovements(results);
                    setIsLoading(false);
                },
                error: (err) => {
                    setError(err.message);
                    setIsLoading(false);
                },
            });

        return () => subscription.unsubscribe();
    }, [productId]);

    const registerMovement = async (
        product:  Product,
        type:     MovementType,
        qty:      number,
        note?:    string,
    ): Promise<boolean> => {
        if (!user || !company) {
            setError('Usuário não autenticado');
            return false;
        }

        setIsSaving(true);
        setError(null);

        try {
            await database.write(async () => {
                let newQty = product.quantity;
                if (type === 'in')     newQty = product.quantity + qty;
                if (type === 'out')    newQty = Math.max(0, product.quantity - qty);
                if (type === 'adjust') newQty = qty;

                await database.get<Movement>('movements').create((m) => {
                    m.companyId = company.id;
                    m.productId = product.id;
                    m.type      = type;
                    m.quantity  = qty;
                    m.note      = note ?? null;
                    m.createdBy = user.id;
                    m.isDeleted = false;
                });

                await product.update((p) => {
                    p.quantity = newQty;
                });
            });

            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { movements, isLoading, isSaving, error, registerMovement };
}