// ============================================
// 🔐 session.js - Gestão de Sessão (CORRIGIDO)
// ============================================

// IMPORTANTE: Este ficheiro apenas DEFINE funções
// NÃO executa nada automaticamente ao carregar

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
        
        return user;
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return null;
    }
}

// ============================================
// ATUALIZAR UI DO HEADER COM SESSÃO
// ============================================
async function atualizarHeaderComSessao() {
    try {
        const user = await verificarSessaoAtual();
        
        if (!user) {
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
        
        switch (event) {
            case 'SIGNED_IN':
                atualizarHeaderComSessao();
                break;
                
            case 'SIGNED_OUT':
                // Recarregar página para limpar estado
                if (window.location.pathname !== '/index.html' && 
                    window.location.pathname !== '/') {
                    window.location.href = 'index.html';
                }
                break;
                
            case 'TOKEN_REFRESHED':
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
    
    // Redirecionar baseado em estado
    async redirecionar() {
        const user = await verificarSessaoAtual();
        
        if (user) {
            window.location.href = 'area-cliente.html';
        } else {
            window.location.href = 'login.html';
        }
    },
    
    // Fazer logout
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Erro no logout:', error);
            alert('Erro ao sair. Tente novamente.');
        }
    }
};

// Exportar para uso global
window.sessionManager = sessionManager;

// ============================================
// FUNÇÃO DE INICIALIZAÇÃO (CHAMADA MANUALMENTE)
// ============================================
function inicializarSessao() {
    
    // Verificar se supabase existe
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase não está carregado!');
        return false;
    }
    
    // Iniciar listener
    iniciarListenerSessao();
    
    // Atualizar header se houver sessão
    atualizarHeaderComSessao();
    return true;
}

// Exportar função de inicialização
window.inicializarSessao = inicializarSessao;

// ============================================
// NÃO EXECUTA AUTOMATICAMENTE!
// ============================================
// As páginas devem chamar inicializarSessao() manualmente
// quando todos os scripts estiverem carregados
