import { useEffect, useState, useCallback } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database } from '@/database';
import Product from '@/database/models/Product';
import Movement from '@/database/models/Movement';

// ─── Tipos ───────────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 5;
const EXPIRY_DAYS = 30;

export type ExpiringProduct = {
    id: string;
    name: string;
    expiryDate: string;
    daysLeft: number;
    quantity: number;
};

export type ReportData = {
    // Resumo
    totalProducts: number;
    totalStockValue: number;

    // Status
    outOfStockCount: number;
    lowStockCount: number;
    normalStockCount: number;

    // Movimentações
    totalIn: number;
    totalInValue: number;
    totalOut: number;
    totalOutValue: number;

    // Vencimento
    expiringProducts: ExpiringProduct[];

    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function parseExpiryDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;

    // Formato brasileiro DD/MM/AAAA
    const dmyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dmyMatch = dateStr.match(dmyRegex);
    if (dmyMatch) {
        const [_, dayStr, monthStr, yearStr] = dmyMatch;
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    // Tenta formato padrão (ISO ou YYYY-MM-DD)
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
}

function getDaysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = parseExpiryDate(dateStr);
    if (!target) return 99999; // Ignorar se data inválida
    
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReportData(
    companyId: string,
    startDate?: Date | null,
    endDate?: Date | null
): ReportData {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Resumo
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalStockValue, setTotalStockValue] = useState(0);

    // Status
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [normalStockCount, setNormalStockCount] = useState(0);

    // Movimentações
    const [totalIn, setTotalIn] = useState(0);
    const [totalInValue, setTotalInValue] = useState(0);
    const [totalOut, setTotalOut] = useState(0);
    const [totalOutValue, setTotalOutValue] = useState(0);

    // Vencimento
    const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>([]);

    const refetch = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    // Helper de filtragem por período
    const isWithinPeriod = useCallback((date: Date) => {
        if (!startDate || !endDate) return true;
        const time = date.getTime();
        return time >= startDate.getTime() && time <= endDate.getTime();
    }, [startDate, endDate]);

    // ── Observar produtos ──
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const productCollection = database.get<Product>('products');

        const conditions = [
            Q.where('is_deleted', Q.notEq(true)),
        ];

        if (companyId) {
            conditions.push(Q.where('company_id', companyId));
        }

        const subscription = productCollection
            .query(...conditions)
            .observe()
            .subscribe({
                next: (products) => {
                    let filteredProductsCount = 0;
                    let stockValue = 0;
                    let outCount = 0;
                    let lowCount = 0;
                    let normalCount = 0;
                    const expiring: ExpiringProduct[] = [];

                    for (const p of products) {
                        const createdDate = p.createdAt || new Date();
                        
                        // Filtrar para estatísticas gerais
                        if (isWithinPeriod(createdDate)) {
                            filteredProductsCount++;
                            stockValue += p.quantity * p.value;

                            if (p.quantity === 0) {
                                outCount++;
                            } else if (p.quantity <= LOW_STOCK_THRESHOLD) {
                                lowCount++;
                            } else {
                                normalCount++;
                            }
                        }

                        // Alerta de vencimento (independe do período selecionado de cadastro)
                        if (p.expiryDate) {
                            const daysLeft = getDaysUntil(p.expiryDate);
                            // Mostra produtos vencidos ou a vencer nos próximos 30 dias
                            if (daysLeft <= EXPIRY_DAYS) {
                                expiring.push({
                                    id: p.id,
                                    name: p.name,
                                    expiryDate: p.expiryDate,
                                    daysLeft,
                                    quantity: p.quantity,
                                });
                            }
                        }
                    }

                    setTotalProducts(filteredProductsCount);
                    setTotalStockValue(stockValue);
                    setOutOfStockCount(outCount);
                    setLowStockCount(lowCount);
                    setNormalStockCount(normalCount);

                    // Ordenar por dias restantes (mais urgente primeiro)
                    expiring.sort((a, b) => a.daysLeft - b.daysLeft);
                    setExpiringProducts(expiring);

                    setIsLoading(false);
                },
                error: (err) => {
                    console.error('[useReportData] products error:', err);
                    setError(err.message);
                    setIsLoading(false);
                },
            });

        return () => subscription.unsubscribe();
    }, [companyId, refreshKey, startDate, endDate, isWithinPeriod]);

    // ── Observar movimentações ──
    useEffect(() => {
        const movementCollection = database.get<Movement>('movements');
        const productCollection = database.get<Product>('products');

        const movConditions = [
            Q.where('is_deleted', Q.notEq(true)),
        ];
        const prodConditions = [
            Q.where('is_deleted', Q.notEq(true)),
        ];

        if (companyId) {
            movConditions.push(Q.where('company_id', companyId));
            prodConditions.push(Q.where('company_id', companyId));
        }

        const subscription = movementCollection
            .query(...movConditions)
            .observe()
            .subscribe({
                next: async (movements) => {
                    try {
                        // Buscar todos os produtos para lookup de valor
                        const allProducts = await productCollection
                            .query(...prodConditions)
                            .fetch();

                        const productMap = new Map<string, Product>();
                        for (const p of allProducts) {
                            productMap.set(p.id, p);
                        }

                        let inQty = 0;
                        let inVal = 0;
                        let outQty = 0;
                        let outVal = 0;

                        for (const m of movements) {
                            const createdDate = m.createdAt || new Date();
                            if (!isWithinPeriod(createdDate)) continue;

                            const product = productMap.get(m.productId);
                            const unitValue = product?.value ?? 0;

                            if (m.type === 'in') {
                                inQty += m.quantity;
                                inVal += m.quantity * unitValue;
                            } else if (m.type === 'out') {
                                outQty += m.quantity;
                                outVal += m.quantity * unitValue;
                            }
                        }

                        setTotalIn(inQty);
                        setTotalInValue(inVal);
                        setTotalOut(outQty);
                        setTotalOutValue(outVal);
                    } catch (err: any) {
                        console.error('[useReportData] movements calc error:', err);
                    }
                },
                error: (err) => {
                    console.error('[useReportData] movements error:', err);
                },
            });

        return () => subscription.unsubscribe();
    }, [companyId, refreshKey, startDate, endDate, isWithinPeriod]);

    return {
        totalProducts,
        totalStockValue,
        outOfStockCount,
        lowStockCount,
        normalStockCount,
        totalIn,
        totalInValue,
        totalOut,
        totalOutValue,
        expiringProducts,
        isLoading,
        error,
        refetch,
    };
}
