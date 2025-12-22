// ============================================
// 🔐 session.js - Gestão de Sessão (CORRIGIDO)
// ============================================

// IMPORTANTE: Este ficheiro apenas DEFINE funções
// NÃO executa nada automaticamente ao carregar

console.log('📦 session.js carregado');

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
                atualizarHeaderComSessao();
                break;
                
            case 'SIGNED_OUT':
                console.log('👋 Utilizador fez logout');
                // Recarregar página para limpar estado
                if (window.location.pathname !== '/index.html' && 
                    window.location.pathname !== '/') {
                    window.location.href = 'index.html';
                }
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('🔄 Token atualizado');
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
            
            console.log('✅ Logout bem-sucedido');
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
    console.log('🔐 Inicializando gestão de sessão...');
    
    // Verificar se supabase existe
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase não está carregado!');
        return false;
    }
    
    // Iniciar listener
    iniciarListenerSessao();
    
    // Atualizar header se houver sessão
    atualizarHeaderComSessao();
    
    console.log('✅ Gestão de sessão inicializada');
    return true;
}

// Exportar função de inicialização
window.inicializarSessao = inicializarSessao;

// ============================================
// NÃO EXECUTA AUTOMATICAMENTE!
// ============================================
// As páginas devem chamar inicializarSessao() manualmente
// quando todos os scripts estiverem carregados

console.log('✅ session.js pronto (aguardando inicialização manual)');