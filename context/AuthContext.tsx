import { supabase } from '@/lib/supabase';
import { PlanType } from '@/constants/plans';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export type Company = {
    id:   string;
    name: string;
    plan: PlanType;
};

export type AuthUser = {
    id:        string;
    email:     string;
    fullName:  string;
    avatarUrl: string | null;
};

type AuthContextType = {
    // Estado
    user:        AuthUser | null;
    company:     Company | null;
    role:        UserRole | null;
    plan:        PlanType;
    session:     Session | null;
    isLoading:   boolean;
    isAuthenticated: boolean;

    // Auth
    signIn:      (email: string, password: string) => Promise<{ error?: string }>;
    signUp:      (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
    signOut:     () => Promise<void>;
    signInWithGoogle: () => Promise<{ error?: string }>;

    // Company
    createCompany:  (name: string) => Promise<{ error?: string }>;
    switchCompany:  (companyId: string) => Promise<void>;

    // Helpers de permissão
    can: (action: 'edit' | 'delete' | 'manage_users' | 'view_reports') => boolean;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session,   setSession]   = useState<Session | null>(null);
    const [user,      setUser]      = useState<AuthUser | null>(null);
    const [company,   setCompany]   = useState<Company | null>(null);
    const [role,      setRole]      = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const plan: PlanType = company?.plan ?? 'free';

    // ── Carrega sessão ao iniciar ──
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) loadUserData(session.user);
            else setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                if (session) await loadUserData(session.user);
                else {
                    setUser(null);
                    setCompany(null);
                    setRole(null);
                    setIsLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // ── Carrega perfil + empresa ──
    const loadUserData = async (authUser: User) => {
        try {
            // Perfil
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            setUser({
                id:        authUser.id,
                email:     authUser.email ?? '',
                fullName:  profile?.full_name ?? '',
                avatarUrl: profile?.avatar_url ?? null,
            });

            // Empresa + role
            const { data: membership } = await supabase
                .from('company_members')
                .select('role, companies(*)')
                .eq('user_id', authUser.id)
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (membership) {
                const comp = membership.companies as any;
                setCompany({ id: comp.id, name: comp.name, plan: comp.plan });
                setRole(membership.role as UserRole);
            }
        } catch (error) {
            console.error('loadUserData error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Sign In ──
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return {};
    };

    // ── Sign Up ──
    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) return { error: error.message };
        return {};
    };

    // ── Sign Out ──
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    // ── Google ──
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'kardex://auth/callback' },
        });
        if (error) return { error: error.message };
        return {};
    };

    // ── Criar empresa ──
    const createCompany = async (name: string) => {
        if (!user) return { error: 'Usuário não autenticado' };

        const { data: comp, error: compError } = await supabase
            .from('companies')
            .insert({ name, owner_id: user.id })
            .select()
            .single();

        if (compError) return { error: compError.message };

        // Adiciona como admin
        const { error: memberError } = await supabase
            .from('company_members')
            .insert({ company_id: comp.id, user_id: user.id, role: 'admin' });

        if (memberError) return { error: memberError.message };

        setCompany({ id: comp.id, name: comp.name, plan: comp.plan });
        setRole('admin');
        return {};
    };

    // ── Trocar empresa ──
    const switchCompany = async (companyId: string) => {
        const { data } = await supabase
            .from('company_members')
            .select('role, companies(*)')
            .eq('user_id', user?.id)
            .eq('company_id', companyId)
            .single();

        if (data) {
            const comp = data.companies as any;
            setCompany({ id: comp.id, name: comp.name, plan: comp.plan });
            setRole(data.role as UserRole);
        }
    };

    // ── Permissões por role ──
    const can = (action: 'edit' | 'delete' | 'manage_users' | 'view_reports'): boolean => {
        if (!role) return false;
        switch (action) {
            case 'edit':         return ['admin', 'manager'].includes(role);
            case 'delete':       return role === 'admin';
            case 'manage_users': return role === 'admin';
            case 'view_reports': return ['admin', 'manager'].includes(role);
            default:             return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user, company, role, plan, session,
            isLoading, isAuthenticated: !!session,
            signIn, signUp, signOut, signInWithGoogle,
            createCompany, switchCompany, can,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    return useContext(AuthContext);
}