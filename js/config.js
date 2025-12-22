// ============================================
// 📁 config.js - Configuração do Supabase
// ============================================

// ⚠️ IMPORTANTE: Estas são as suas credenciais Supabase
// Em produção, considere usar variáveis de ambiente

const SUPABASE_URL = 'https://ugrigjbdtbrhyytsgbzb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-deEmuYKcp5hAgZ-cEYscg_PpoSM_o-';

// ============================================
// Criar cliente Supabase
// ============================================

// Verificar se a biblioteca Supabase foi carregada
if (typeof window.supabase === 'undefined') {
    console.error('❌ ERRO: Biblioteca Supabase não foi carregada!');
    console.error('Certifique-se que tem esta tag ANTES do config.js:');
    console.error('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
} else {
    // Criar o cliente Supabase usando o método correto
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Tornar disponível globalmente
    window.supabase = supabase;
    
    console.log('✅ Supabase inicializado com sucesso!');
    console.log('URL:', SUPABASE_URL);
}

// ============================================
// Exportar para usar noutros ficheiros
// ============================================

// Nota: Como estamos a usar <script> tags no HTML,
// o supabase já está disponível em window.supabase
// e pode ser usado em qualquer ficheiro JS carregado depois