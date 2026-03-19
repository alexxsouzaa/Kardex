import { canPerformAction, getPlanLimits, PlanLimits, PlanType } from '@/constants/plans';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePlan() {
    const { plan } = useAuth();
    const limits   = getPlanLimits(plan);

    // Verifica se pode realizar ação e mostra alerta se não puder
    const check = (
        action: keyof PlanLimits,
        currentCount?: number,
        onUpgrade?: () => void
    ): boolean => {
        const { allowed, message } = canPerformAction(plan, action, currentCount);

        if (!allowed) {
            Alert.alert(
                '🔒 Limite do plano gratuito',
                `${message}\n\nFaça upgrade para o plano Pro e desbloqueie todos os recursos.`,
                [
                    { text: 'Agora não', style: 'cancel' },
                    { text: 'Ver plano Pro', onPress: onUpgrade, style: 'default' },
                ]
            );
            return false;
        }

        return true;
    };

    return {
        plan,
        limits,
        isPro:  plan === 'pro',
        isFree: plan === 'free',
        check,
    };
}