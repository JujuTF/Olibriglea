// ============================================
// 📁 config.js - TESTE 1: Usando ANON KEY (JWT)
// ============================================

const SUPABASE_URL = 'https://ugrigjbdtbrhyytsgbzb.supabase.co';
// TESTE 1: Usando a ANON KEY (formato JWT)
const SUPABASE_ANON_KEY = 'sb_publishable_-deEmuYKcp5hAgZ-cEYscg_PpoSM_o-';


if (typeof window.supabase === 'undefined') {
    console.error('❌ Biblioteca Supabase não carregada!');
    throw new Error('Supabase library not found');
}

try {
    const { createClient } = window.supabase;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });
    
    window.supabase = supabase;
    
    // Teste de conexão
    (async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('❌ TESTE 1 FALHOU:', error.message);
            } 
        } catch (e) {
            console.error('❌ TESTE 1 ERRO:', e);
        }
    })();
    
} catch (error) {
    console.error('❌ Erro TESTE 1:', error);
    throw error;
}