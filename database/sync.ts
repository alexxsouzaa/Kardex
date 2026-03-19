import { synchronize } from '@nozbe/watermelondb/sync';
import { database }    from './index';
import { supabase }    from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type SyncOptions = {
    companyId: string;
    userId:    string;
    isPro:     boolean;
};

// ─── Sync principal ───────────────────────────────────────────────────────────

export async function syncDatabase({ companyId, userId, isPro }: SyncOptions) {
    if (!isPro) {
        console.log('Sync disponível apenas no plano Pro.');
        return { success: false, reason: 'not_pro' };
    }

    try {
        await synchronize({
            database,

            // ── Pull: busca mudanças do Supabase ──
            pullChanges: async ({ lastPulledAt }) => {
                const timestamp = lastPulledAt
                    ? new Date(lastPulledAt).toISOString()
                    : new Date(0).toISOString();

                // Produtos
                const { data: products, error: pErr } = await supabase
                    .from('products')
                    .select('*')
                    .eq('company_id', companyId)
                    .gt('updated_at', timestamp);

                if (pErr) throw pErr;

                // Movimentos
                const { data: movements, error: mErr } = await supabase
                    .from('movements')
                    .select('*')
                    .eq('company_id', companyId)
                    .gt('created_at', timestamp);

                if (mErr) throw mErr;

                // Mapeia formato Supabase → WatermelonDB
                const mapProduct = (p: any) => ({
                    id:          p.id,
                    remote_id:   p.id,
                    company_id:  p.company_id,
                    name:        p.name,
                    ean_code:    p.ean_code,
                    lote:        p.lote,
                    quantity:    p.quantity,
                    unit:        p.unit,
                    packaging:   p.packaging,
                    value:       p.value,
                    expiry_date: p.expiry_date,
                    category:    p.category,
                    type:        p.type,
                    brand:       p.brand,
                    supplier:    p.supplier,
                    images:      JSON.stringify(p.images ?? []),
                    created_by:  p.created_by,
                    created_at:  new Date(p.created_at).getTime(),
                    updated_at:  new Date(p.updated_at).getTime(),
                    is_deleted:  !!p.deleted_at,
                });

                const mapMovement = (m: any) => ({
                    id:         m.id,
                    remote_id:  m.id,
                    company_id: m.company_id,
                    product_id: m.product_id,
                    type:       m.type,
                    quantity:   m.quantity,
                    note:       m.note,
                    created_by: m.created_by,
                    created_at: new Date(m.created_at).getTime(),
                    is_deleted: false,
                });

                return {
                    changes: {
                        products:  { created: products?.map(mapProduct) ?? [],  updated: [], deleted: [] },
                        movements: { created: movements?.map(mapMovement) ?? [], updated: [], deleted: [] },
                    },
                    timestamp: Date.now(),
                };
            },

            // ── Push: envia mudanças locais para Supabase ──
            pushChanges: async ({ changes }) => {
                const { products, movements } = changes;

                // Produtos criados/atualizados
                if (products?.created?.length) {
                    const toInsert = products.created.map((p: any) => ({
                        id:          p.remote_id ?? p.id,
                        company_id:  companyId,
                        name:        p.name,
                        ean_code:    p.ean_code,
                        lote:        p.lote,
                        quantity:    p.quantity,
                        unit:        p.unit,
                        packaging:   p.packaging,
                        value:       p.value,
                        expiry_date: p.expiry_date,
                        category:    p.category,
                        type:        p.type,
                        brand:       p.brand,
                        supplier:    p.supplier,
                        images:      JSON.parse(p.images ?? '[]'),
                        created_by:  userId,
                    }));
                    await supabase.from('products').upsert(toInsert);
                }

                if (products?.updated?.length) {
                    for (const p of products.updated) {
                        await supabase
                            .from('products')
                            .update({
                                name:        p.name,
                                ean_code:    p.ean_code,
                                quantity:    p.quantity,
                                unit:        p.unit,
                                value:       p.value,
                                category:    p.category,
                                type:        p.type,
                                brand:       p.brand,
                                supplier:    p.supplier,
                                images:      JSON.parse(p.images ?? '[]'),
                            })
                            .eq('id', p.remote_id ?? p.id);
                    }
                }

                if (products?.deleted?.length) {
                    for (const id of products.deleted) {
                        await supabase
                            .from('products')
                            .update({ deleted_at: new Date().toISOString() })
                            .eq('id', id);
                    }
                }

                // Movimentos criados
                if (movements?.created?.length) {
                    const toInsert = movements.created.map((m: any) => ({
                        id:         m.remote_id ?? m.id,
                        company_id: companyId,
                        product_id: m.product_id,
                        type:       m.type,
                        quantity:   m.quantity,
                        note:       m.note,
                        created_by: userId,
                    }));
                    await supabase.from('movements').upsert(toInsert);
                }
            },

            migrationsEnabledAtVersion: 1,
        });

        return { success: true };
    } catch (error) {
        console.error('Sync error:', error);
        return { success: false, reason: 'sync_failed', error };
    }
}