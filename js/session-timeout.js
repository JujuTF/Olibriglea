// ============================================
// 🔐 session-timeout.js - Expiração Automática de Sessão
// ============================================

console.log('📦 session-timeout.js carregado');

// ============================================
// CONFIGURAÇÕES
// ============================================
const SESSION_CONFIG = {
    // Tempo de inatividade antes de expirar (em minutos)
    TIMEOUT_MINUTES: 30,
    
    // Tempo de aviso antes de expirar (em minutos)
    WARNING_MINUTES: 5,
    
    // Verificar sessão a cada X segundos
    CHECK_INTERVAL: 60
};

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let lastActivity = Date.now();
let sessionCheckInterval = null;
let warningShown = false;

// ============================================
// REGISTRAR ATIVIDADE DO UTILIZADOR
// ============================================
function registrarAtividade() {
    lastActivity = Date.now();
    warningShown = false;
    console.log('👆 Atividade registrada:', new Date(lastActivity).toLocaleTimeString());
}

// ============================================
// VERIFICAR TEMPO DE INATIVIDADE
// ============================================
function verificarInatividade() {
    const agora = Date.now();
    const tempoInativo = Math.floor((agora - lastActivity) / 1000 / 60); // em minutos
    
    const tempoRestante = SESSION_CONFIG.TIMEOUT_MINUTES - tempoInativo;
    
    console.log(`⏱️ Tempo inativo: ${tempoInativo} min | Tempo restante: ${tempoRestante} min`);
    
    // Mostrar aviso
    if (tempoRestante <= SESSION_CONFIG.WARNING_MINUTES && !warningShown) {
        mostrarAvisoExpiracao(tempoRestante);
        warningShown = true;
    }
    
    // Expirar sessão
    if (tempoInativo >= SESSION_CONFIG.TIMEOUT_MINUTES) {
        expirarSessao();
    }
}

// ============================================
// MOSTRAR AVISO DE EXPIRAÇÃO
// ============================================
function mostrarAvisoExpiracao(minutosRestantes) {
    console.warn(`⚠️ Sessão vai expirar em ${minutosRestantes} minutos`);
    
    // Modal ou alert
    const continuar = confirm(
        `⚠️ A sua sessão vai expirar em ${minutosRestantes} minutos por inatividade.\n\n` +
        `Clique OK para continuar a sessão.`
    );
    
    if (continuar) {
        registrarAtividade();
    }
}

// ============================================
// EXPIRAR SESSÃO
// ============================================
async function expirarSessao() {
    console.log('⏰ Sessão expirada por inatividade');
    
    // Parar verificação
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
    }
    
    try {
        // Fazer logout no Supabase
        if (typeof supabase !== 'undefined') {
            await supabase.auth.signOut();
        }
        
        // Mostrar mensagem
        alert('⏰ Sua sessão expirou por inatividade.\n\nPor favor, faça login novamente.');
        
        // Redirecionar para login
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Erro ao expirar sessão:', error);
        window.location.href = 'login.html';
    }
}

// ============================================
// INICIAR MONITORAMENTO DE SESSÃO
// ============================================
function iniciarMonitoramentoSessao() {
    console.log('🔐 Iniciando monitoramento de sessão...');
    console.log(`⏱️ Timeout: ${SESSION_CONFIG.TIMEOUT_MINUTES} minutos`);
    console.log(`⚠️ Aviso: ${SESSION_CONFIG.WARNING_MINUTES} minutos antes`);
    
    // Registrar atividade inicial
    registrarAtividade();
    
    // Eventos de atividade do utilizador
    const eventos = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
    ];
    
    eventos.forEach(evento => {
        document.addEventListener(evento, registrarAtividade, { passive: true });
    });
    
    // Verificar inatividade periodicamente
    sessionCheckInterval = setInterval(
        verificarInatividade,
        SESSION_CONFIG.CHECK_INTERVAL * 1000
    );
    
    console.log('✅ Monitoramento de sessão ativo');
}

// ============================================
// PARAR MONITORAMENTO
// ============================================
function pararMonitoramentoSessao() {
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        console.log('🛑 Monitoramento de sessão parado');
    }
}

// ============================================
// VERIFICAR SESSÃO SUPABASE
// ============================================
async function verificarSessaoSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.warn('Supabase não carregado');
            return false;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            return false;
        }
        
        if (!session) {
            console.log('Sem sessão ativa');
            return false;
        }
        
        // Verificar se token expirou
        const agora = Math.floor(Date.now() / 1000);
        const tokenExpira = session.expires_at;
        
        if (tokenExpira && agora > tokenExpira) {
            console.warn('Token expirado!');
            await expirarSessao();
            return false;
        }
        
        console.log('✅ Sessão válida');
        return true;
        
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return false;
    }
}

// ============================================
// RENOVAR TOKEN AUTOMATICAMENTE
// ============================================
async function renovarTokenAutomatico() {
    try {
        if (typeof supabase === 'undefined') return;
        
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
            console.error('Erro ao renovar token:', error);
            return;
        }
        
        if (data.session) {
            console.log('✅ Token renovado com sucesso');
            registrarAtividade();
        }
        
    } catch (error) {
        console.error('Erro ao renovar token:', error);
    }
}

// ============================================
// AUTO-INICIALIZAÇÃO
// ============================================
// Iniciar automaticamente quando documento carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        // Aguardar um pouco para garantir que Supabase carregou
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar se tem sessão ativa
        const temSessao = await verificarSessaoSupabase();
        
        if (temSessao) {
            iniciarMonitoramentoSessao();
            
            // Renovar token a cada 15 minutos
            setInterval(renovarTokenAutomatico, 15 * 60 * 1000);
        }
    });
} else {
    // Documento já carregou
    setTimeout(async () => {
        const temSessao = await verificarSessaoSupabase();
        if (temSessao) {
            iniciarMonitoramentoSessao();
            setInterval(renovarTokenAutomatico, 15 * 60 * 1000);
        }
    }, 500);
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
window.sessionTimeout = {
    iniciar: iniciarMonitoramentoSessao,
    parar: pararMonitoramentoSessao,
    registrar: registrarAtividade,
    expirar: expirarSessao,
    verificar: verificarSessaoSupabase,
    renovar: renovarTokenAutomatico
};

console.log('✅ session-timeout.js pronto');
