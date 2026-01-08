// ============================================
// 📁 config.js - Configuração do Supabase (SEGURO)
// ============================================

// Verificar se está em desenvolvimento ou produção
const isDev = window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1';

// Obter variáveis de ambiente (Vercel injeta automaticamente)
const SUPABASE_URL = isDev 
    ? 'https://ugrigjbdtbrhyytsgbzb.supabase.co'  // Dev local
    : (window.ENV?.SUPABASE_URL || 'https://ugrigjbdtbrhyytsgbzb.supabase.co');

const SUPABASE_ANON_KEY = isDev
    ? 'sb_publishable_-deEmuYKcp5hAgZ-cEYscg_PpoSM_o-'  // Dev local
    : (window.ENV?.SUPABASE_ANON_KEY || 'sb_publishable_-deEmuYKcp5hAgZ-cEYscg_PpoSM_o-');

// ============================================
// Criar cliente Supabase
// ============================================

if (typeof window.supabase === 'undefined') {
    console.error('❌ ERRO: Biblioteca Supabase não foi carregada!');
} else {
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    window.supabase = supabase;
    
    console.log('✅ Supabase inicializado');
    console.log('🌍 Ambiente:', isDev ? 'Desenvolvimento' : 'Produção');
}

window.supabase = supabase;