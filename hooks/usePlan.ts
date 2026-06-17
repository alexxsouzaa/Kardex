import { canPerformAction, getPlanLimits, PlanLimits } from '@/constants/plans';
import { useApp } from '@/context/AppContext';
import { Alert } from 'react-native';

export function usePlan() {
    const app = useApp();

    const plan = app?.plan ?? 'free';

    const limits = getPlanLimits(plan);

    const check = (
        action: keyof PlanLimits,
        currentCount?: number,
        onUpgrade?: () => void
    ): boolean => {
        const { allowed, message } = canPerformAction(
            plan,
            action,
            currentCount
        );

        if (!allowed) {
            Alert.alert(
                '🔒 Limite do plano gratuito',
                `${message}\n\nFaça upgrade para o plano Pro.`,
                [
                    { text: 'Agora não', style: 'cancel' },
                    {
                        text: 'Ver plano Pro',
                        onPress: onUpgrade,
                        style: 'default',
                    },
                ]
            );

            return false;
        }

        return true;
    };

    return {
        plan,
        limits,
        isPro: plan === 'pro',
        isFree: plan === 'free',
        check,
    };
}