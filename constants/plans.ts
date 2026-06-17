// ─── Tipos ───────────────────────────────────────────────────────────────────

export type PlanType = 'free' | 'pro';

export type PlanLimits = {
    maxProducts:    number;
    maxUsers:       number;
    maxPhotos:      number;
    maxDeposits:    number;
    hasReports:     boolean;
    hasCloudSync:   boolean;
    hasMultiDeposit: boolean;
};

// ─── Limites por plano ───────────────────────────────────────────────────────

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
        maxProducts:     50,
        maxUsers:         2,
        maxPhotos:        5,
        maxDeposits:      1,
        hasReports:       false,
        hasCloudSync:     false,
        hasMultiDeposit:  false,
    },
    pro: {
        maxProducts:     Infinity,
        maxUsers:        Infinity,
        maxPhotos:        5,
        maxDeposits:     Infinity,
        hasReports:       true,
        hasCloudSync:     true,
        hasMultiDeposit:  true,
    },
};

// ─── Mensagens de upgrade ─────────────────────────────────────────────────────

export const UPGRADE_MESSAGES: Record<string, string> = {
    maxProducts:    'Você atingiu o limite de 50 produtos no plano gratuito.',
    maxUsers:       'Você atingiu o limite de 2 usuários no plano gratuito.',
    maxPhotos:      'Você atingiu o limite de 5 fotos por produto.',
    hasReports:     'Relatórios estão disponíveis apenas no plano Pro.',
    hasCloudSync:   'Sincronização na nuvem está disponível apenas no plano Pro.',
    hasMultiDeposit:'Múltiplos depósitos estão disponíveis apenas no plano Pro.',
};

// ─── Helper ──────────────────────────────────────────────────────────────────

export function getPlanLimits(plan: PlanType): PlanLimits {
    return PLAN_LIMITS[plan];
}

export function canPerformAction(
    plan: PlanType,
    action: keyof PlanLimits,
    currentCount?: number
): { allowed: boolean; message?: string } {
    const limits = PLAN_LIMITS[plan];
    const limit  = limits[action];

    if (typeof limit === 'boolean') {
        return limit
            ? { allowed: true }
            : { allowed: false, message: UPGRADE_MESSAGES[action] };
    }

    if (typeof currentCount === 'number' && typeof limit === 'number') {
        return currentCount < limit
            ? { allowed: true }
            : { allowed: false, message: UPGRADE_MESSAGES[action] };
    }

    return { allowed: true };
}