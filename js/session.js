// ============================================
// 🔐 session.js - Gestão de Sessão (VERSÃO COMPLETA)
// ============================================

console.log('📦 session.js carregado');

// ============================================
// CONFIGURAÇÃO DE TEMPO DE SESSÃO
// ============================================
const SESSION_CONFIG = {
    // Tempo máximo de sessão: 24 horas (em milissegundos)
    MAX_DURATION: 24 * 60 * 60 * 1000,
    
    // Tempo de inatividade: 2 horas (em milissegundos)
    INACTIVITY_TIMEOUT: 2 * 60 * 60 * 1000,
    
    // Chaves de armazenamento
    LAST_ACTIVITY_KEY: 'olibriglea_last_activity',
    SESSION_START_KEY: 'olibriglea_session_start'
};

// ============================================
// VERIFICAR VALIDADE DA SESSÃO
// ============================================
async function verificarValidadeSessao() {
    try {
        const agora = Date.now();
        
        // Verificar início da sessão
        const sessionStart = localStorage.getItem(SESSION_CONFIG.SESSION_START_KEY);
        if (sessionStart) {
            const tempoDecorrido = agora - parseInt(sessionStart);
            
            // Sessão passou do tempo máximo?
            if (tempoDecorrido > SESSION_CONFIG.MAX_DURATION) {
                console.log('⏰ Sessão expirou por tempo máximo (24h)');
                return false;
            }
        }
        
        // Verificar última atividade
        const lastActivity = localStorage.getItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
        if (lastActivity) {
            const tempoInativo = agora - parseInt(lastActivity);
            
            // Ultrapassou tempo de inatividade?
            if (tempoInativo > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
                console.log('⏰ Sessão expirou por inatividade (2h)');
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao verificar validade:', error);
        return true; // Em caso de erro, manter sessão
    }
}

// ============================================
// ATUALIZAR ÚLTIMA ATIVIDADE
// ============================================
function atualizarAtividade() {
    const agora = Date.now().toString();
    localStorage.setItem(SESSION_CONFIG.LAST_ACTIVITY_KEY, agora);
    
    // Se não existe início de sessão, criar agora
    if (!localStorage.getItem(SESSION_CONFIG.SESSION_START_KEY)) {
        localStorage.setItem(SESSION_CONFIG.SESSION_START_KEY, agora);
    }
}

// ============================================
// EXPIRAR SESSÃO
// ============================================
async function expirarSessao() {
    try {
        // Limpar localStorage
        localStorage.removeItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
        localStorage.removeItem(SESSION_CONFIG.SESSION_START_KEY);
        
        // Fazer logout no Supabase
        if (typeof supabase !== 'undefined') {
            await supabase.auth.signOut();
        }
        
        console.log('✅ Sessão expirada com sucesso');
        
        // Redirecionar para login
        const paginasProtegidas = [
            '/area-cliente.html',
            '/backoffice-pontos.html',
            '/10-pontos-celebracao.html'
        ];
        
        const paginaAtual = window.location.pathname;
        const ehPaginaProtegida = paginasProtegidas.some(p => paginaAtual.includes(p));
        
        if (ehPaginaProtegida) {
            alert('A sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = 'login.html';
        }
        
    } catch (error) {
        console.error('Erro ao expirar sessão:', error);
    }
}

// ============================================
// VERIFICAR SESSÃO ATUAL
// ============================================
async function verificarSessaoAtual() {
    try {
        // Verificar se supabase existe
        if (typeof supabase === 'undefined') {
            console.warn('Supabase ainda não carregado');
            return null;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            return null;
        }
        
        // Se tem utilizador, verificar se a sessão ainda é válida
        if (user) {
            const sessaoValida = await verificarValidadeSessao();
            
            if (!sessaoValida) {
                console.log('⏰ Sessão expirada, fazendo logout...');
                await expirarSessao();
                return null;
            }
            
            // Atualizar última atividade
            atualizarAtividade();
        }
        
        return user;
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return null;
    }
}

// ============================================
// INICIAR MONITORIZAÇÃO DE ATIVIDADE
// ============================================
function iniciarMonitorizacaoAtividade() {
    console.log('🔍 Iniciando monitorização de atividade...');
    
    // Lista de eventos que contam como atividade
    const eventosAtividade = [
        'mousedown',
        'keydown',
        'scroll',
        'touchstart',
        'click'
    ];
    
    // Throttle: só atualizar a cada 30 segundos
    let ultimaAtualizacao = 0;
    const INTERVALO_ATUALIZACAO = 30 * 1000; // 30 segundos
    
    const handleAtividade = () => {
        const agora = Date.now();
        
        if (agora - ultimaAtualizacao > INTERVALO_ATUALIZACAO) {
            atualizarAtividade();
            ultimaAtualizacao = agora;
            console.log('📝 Atividade atualizada');
        }
    };
    
    // Adicionar listeners
    eventosAtividade.forEach(evento => {
        window.addEventListener(evento, handleAtividade, { passive: true });
    });
    
    console.log('✅ Listeners de atividade adicionados');
    
    // Verificar periodicamente se sessão ainda é válida
    const intervalo = setInterval(async () => {
        if (typeof supabase === 'undefined') return;
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const valida = await verificarValidadeSessao();
            
            if (!valida) {
                console.log('⏰ Verificação periódica: sessão inválida');
                clearInterval(intervalo); // Parar verificação
                await expirarSessao();
            }
        }
    }, 60 * 1000); // Verificar a cada minuto
    
    console.log('✅ Monitorização de atividade iniciada');
    console.log(`⏰ Tempo máximo de sessão: ${SESSION_CONFIG.MAX_DURATION / (60 * 60 * 1000)} horas`);
    console.log(`⏰ Tempo de inatividade: ${SESSION_CONFIG.INACTIVITY_TIMEOUT / (60 * 60 * 1000)} horas`);
}

// ============================================
// ATUALIZAR UI DO HEADER COM SESSÃO
// ============================================
async function atualizarHeaderComSessao() {
    try {
        const user = await verificarSessaoAtual();
        
        if (!user) {
            console.log('Nenhum utilizador logado');
            return;
        }

        // Buscar dados do utilizador
        const { data: userData, error } = await supabase
            .from('users')
            .select('nome, apelido')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Erro ao buscar dados do utilizador:', error);
            return;
        }

        // Atualizar botão de login para mostrar nome
        const btnLogin = document.querySelector('.btn-login-header');
        
        if (btnLogin && userData) {
            const primeiroNome = userData.nome;
            btnLogin.textContent = `Olá, ${primeiroNome}`;
            btnLogin.href = 'area-cliente.html';
            
            console.log('✅ Header atualizado com sessão');
        }

    } catch (error) {
        console.error('Erro ao atualizar header:', error);
    }
}

// ============================================
// LISTENER DE MUDANÇAS DE AUTENTICAÇÃO
// ============================================
function iniciarListenerSessao() {
    if (typeof supabase === 'undefined') {
        console.warn('Supabase não disponível para listener');
        return;
    }

    supabase.auth.onAuthStateChange((event, session) => {
        console.log('📡 Mudança de autenticação:', event);
        
        switch (event) {
            case 'SIGNED_IN':
                console.log('✅ Utilizador fez login');
                // Registar início de sessão
                localStorage.setItem(SESSION_CONFIG.SESSION_START_KEY, Date.now().toString());
                localStorage.setItem(SESSION_CONFIG.LAST_ACTIVITY_KEY, Date.now().toString());
                atualizarHeaderComSessao();
                break;
                
            case 'SIGNED_OUT':
                console.log('👋 Utilizador fez logout');
                // Limpar dados de sessão
                localStorage.removeItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
                localStorage.removeItem(SESSION_CONFIG.SESSION_START_KEY);
                
                // Redirecionar se estiver em página protegida
                const paginasProtegidas = [
                    '/area-cliente.html',
                    '/backoffice-pontos.html',
                    '/10-pontos-celebracao.html'
                ];
                
                const paginaAtual = window.location.pathname;
                const ehPaginaProtegida = paginasProtegidas.some(p => paginaAtual.includes(p));
                
                if (ehPaginaProtegida) {
                    window.location.href = 'login.html';
                }
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('🔄 Token atualizado');
                // Atualizar atividade quando token é renovado
                atualizarAtividade();
                break;
        }
    });
}

// ============================================
// GESTOR DE SESSÃO PRINCIPAL
// ============================================
const sessionManager = {
    // Verificar se está logado
    async verificar() {
        return await verificarSessaoAtual();
    },
    
    // Atualizar UI
    async atualizarUI() {
        await atualizarHeaderComSessao();
    },
    
    // Iniciar listener
    iniciarListener() {
        iniciarListenerSessao();
    },
    
    // Iniciar monitorização
    iniciarMonitorizacao() {
        iniciarMonitorizacaoAtividade();
    },
    
    // Redirecionar baseado em estado
    async redirecionar() {
        const user = await verificarSessaoAtual();
        
        if (user) {
            window.location.href = 'area-cliente.html';
        } else {
            window.location.href = 'login.html';
        }
    },
    
    // Fazer logout manual
    async logout() {
        try {
            // Limpar localStorage
            localStorage.removeItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
            localStorage.removeItem(SESSION_CONFIG.SESSION_START_KEY);
            
            // Logout no Supabase
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            console.log('✅ Logout manual bem-sucedido');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Erro no logout:', error);
            alert('Erro ao sair. Tente novamente.');
        }
    },
    
    // Obter informação de sessão
    getInfo() {
        const lastActivity = localStorage.getItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
        const sessionStart = localStorage.getItem(SESSION_CONFIG.SESSION_START_KEY);
        
        if (!lastActivity || !sessionStart) {
            return null;
        }
        
        const agora = Date.now();
        const tempoSessao = agora - parseInt(sessionStart);
        const tempoInativo = agora - parseInt(lastActivity);
        
        return {
            tempoSessao: Math.floor(tempoSessao / 1000), // segundos
            tempoInativo: Math.floor(tempoInativo / 1000), // segundos
            tempoRestanteMax: Math.floor((SESSION_CONFIG.MAX_DURATION - tempoSessao) / 1000),
            tempoRestanteInatividade: Math.floor((SESSION_CONFIG.INACTIVITY_TIMEOUT - tempoInativo) / 1000)
        };
    }
};

// Exportar para uso global
window.sessionManager = sessionManager;

// ============================================
// FUNÇÃO DE INICIALIZAÇÃO (CHAMADA MANUALMENTE)
// ============================================
function inicializarSessao() {
    console.log('🔐 Inicializando gestão de sessão...');
    
    // Verificar se supabase existe
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase não está carregado!');
        return false;
    }
    
    // Iniciar listener
    iniciarListenerSessao();
    
    // Iniciar monitorização de atividade
    iniciarMonitorizacaoAtividade();
    
    // Atualizar header se houver sessão
    atualizarHeaderComSessao();
    
    console.log('✅ Gestão de sessão inicializada');
    return true;
}

// Exportar função de inicialização
window.inicializarSessao = inicializarSessao;

console.log('✅ session.js pronto (aguardando inicialização manual)');