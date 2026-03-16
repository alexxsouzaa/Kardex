// ─── Paleta de cores do Kardex ───────────────────────────────────────────────

export const Colors = {

    // ── Primária ──
    primary: '#FF4F18',
    primaryLight: '#FFF5F2',

    // ── Fundo ──
    background: '#F1F2F4',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFA',

    // ── Texto ──
    textPrimary: '#292D32',
    textSecondary: '#6B7280',
    textMuted: '#A9A9A9',

    // ── Status ──
    success: '#22C55E',
    successLight: '#DCFCE7',

    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    danger: '#EF4444',
    dangerLight: '#FEE2E2',

    // ── Bordas e divisores ──
    border: '#E5E7EB',
    divider: '#F1F2F4',

    // ── Ícones dos módulos ──
    iconBlue: '#3B82F6',
    iconBlueBg: '#EFF6FF',

    iconPurple: '#8B5CF6',
    iconPurpleBg: '#F5F3FF',

} as const;

export type ColorToken = keyof typeof Colors;