import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { PlanType, getPlanLimits, PlanLimits } from '@/constants/plans';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type Deposit = {
    id:        string;
    name:      string;
    plan:      PlanType;
    createdAt: number;
};

type AppContextType = {
    deposit:     Deposit | null;
    isLoading:   boolean;
    limits:      PlanLimits;
    createDeposit: (name: string) => Promise<void>;
    updateDeposit: (name: string) => Promise<void>;
    resetApp:    () => Promise<void>;
};

// ─── Chaves AsyncStorage ──────────────────────────────────────────────────────

const DEPOSIT_KEY = '@kardex:deposit';

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType>({} as AppContextType);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [deposit,   setDeposit]   = useState<Deposit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const limits = getPlanLimits(deposit?.plan ?? 'free');

    // ── Carrega depósito salvo ──
    useEffect(() => {
        AsyncStorage.getItem(DEPOSIT_KEY)
            .then((raw) => {
                if (raw) setDeposit(JSON.parse(raw));
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // ── Criar depósito ──
    const createDeposit = async (name: string) => {
        const newDeposit: Deposit = {
            id:        Date.now().toString(),
            name:      name.trim(),
            plan:      'free',
            createdAt: Date.now(),
        };
        await AsyncStorage.setItem(DEPOSIT_KEY, JSON.stringify(newDeposit));
        setDeposit(newDeposit);
    };

    // ── Atualizar nome do depósito ──
    const updateDeposit = async (name: string) => {
        if (!deposit) return;
        const updated = { ...deposit, name: name.trim() };
        await AsyncStorage.setItem(DEPOSIT_KEY, JSON.stringify(updated));
        setDeposit(updated);
    };

    // ── Resetar app (apagar tudo) ──
    const resetApp = async () => {
        await AsyncStorage.removeItem(DEPOSIT_KEY);
        setDeposit(null);
    };

    return (
        <AppContext.Provider value={{
            deposit, isLoading, limits,
            createDeposit, updateDeposit, resetApp,
        }}>
            {children}
        </AppContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
    return useContext(AppContext);
}