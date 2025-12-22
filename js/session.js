// ============================================
// 🔐 session.js - Gestão de Sessão
// ============================================

// ============================================
// VERIFICAR SESSÃO E ATUALIZAR UI
// ============================================
async function verificarEAtualizarSessao() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            mostrarUIDeslogado();
            return null;
        }
        
        if (user) {
            console.log('✅ Utilizador logado:', user.email);
            await mostrarUILogado(user);
            return user;
        } else {
            console.log('ℹ️ Nenhum utilizador logado');
            mostrarUIDeslogado();
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro na verificação:', error);
        mostrarUIDeslogado();
        return null;
    }
}

// ============================================
// MOSTRAR UI PARA UTILIZADOR LOGADO
// ============================================
async function mostrarUILogado(user) {
    // Buscar dados completos do utilizador
    const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (error) {
        console.error('Erro ao buscar dados:', error);
        return;
    }
    
    // Atualizar botão de login
    const btnLogin = document.querySelector('.btn-login-header');
    if (btnLogin) {
        btnLogin.textContent = `Olá, ${userData.nome}`;
        btnLogin.href = 'area-cliente.html';
        btnLogin.style.background = 'var(--dourado)';
        btnLogin.style.color = 'var(--azul)';
    }
    
    // Adicionar menu dropdown (opcional)
    const nav = document.querySelector('nav ul.nav-menu');
    if (nav && !document.getElementById('user-menu')) {
        const userMenu = document.createElement('li');
        userMenu.id = 'user-menu';
        userMenu.style.position = 'relative';
        
        userMenu.innerHTML = `
            <a href="#" class="user-menu-toggle" style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${userData.nome}</span>
                <span style="font-size: 0.8rem;">▼</span>
            </a>
            <div class="user-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 200px; z-index: 1000;">
                <a href="area-cliente.html" style="display: block; padding: 1rem; color: var(--azul); text-decoration: none; border-bottom: 1px solid var(--creme);">
                    👤 Minha Conta
                </a>
                <a href="#" class="btn-logout-menu" style="display: block; padding: 1rem; color: #dc2626; text-decoration: none;">
                    🚪 Sair
                </a>
            </div>
        `;
        
        nav.appendChild(userMenu);
        
        // Toggle dropdown
        const toggle = userMenu.querySelector('.user-menu-toggle');
        const dropdown = userMenu.querySelector('.user-dropdown');
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // Logout
        const btnLogoutMenu = userMenu.querySelector('.btn-logout-menu');
        btnLogoutMenu.addEventListener('click', async (e) => {
            e.preventDefault();
            await fazerLogout();
        });
    }
}

// ============================================
// MOSTRAR UI PARA UTILIZADOR DESLOGADO
// ============================================
function mostrarUIDeslogado() {
    // Restaurar botão de login original
    const btnLogin = document.querySelector('.btn-login-header');
    if (btnLogin) {
        btnLogin.textContent = 'Iniciar Sessão';
        btnLogin.href = 'login.html';
        btnLogin.style.background = 'var(--azul)';
        btnLogin.style.color = 'white';
    }
    
    // Remover menu dropdown se existir
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.remove();
    }
}

// ============================================
// PERSISTÊNCIA DE SESSÃO
// ============================================
async function configurarPersistenciaSessao() {
    // O Supabase já mantém a sessão por padrão
    // Mas podemos ouvir mudanças de autenticação
    
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        switch(event) {
            case 'SIGNED_IN':
                console.log('✅ Utilizador fez login');
                verificarEAtualizarSessao();
                break;
                
            case 'SIGNED_OUT':
                console.log('👋 Utilizador fez logout');
                mostrarUIDeslogado();
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('🔄 Token renovado');
                break;
                
            case 'USER_UPDATED':
                console.log('👤 Dados atualizados');
                verificarEAtualizarSessao();
                break;
        }
    });
}

// ============================================
// LOGOUT MELHORADO
// ============================================
async function fazerLogoutCompleto() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Erro no logout:', error);
            // Mesmo com erro, limpar UI
        }
        
        console.log('✅ Logout bem-sucedido');
        
        // Atualizar UI
        mostrarUIDeslogado();
        
        // Redirecionar para home
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('❌ Erro fatal no logout:', error);
        // Forçar logout localmente
        mostrarUIDeslogado();
        window.location.href = 'index.html';
    }
}

// ============================================
// PROTEGER PÁGINA COM REDIRECT
// ============================================
async function protegerPaginaComRedirect(paginaDestino = 'area-cliente.html') {
    const user = await verificarSessao();
    
    if (!user) {
        // Guardar página que tentou aceder
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        
        alert('Precisa de fazer login primeiro!');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ============================================
// REDIRECT APÓS LOGIN
// ============================================
function redirecionarAposLogin() {
    // Ver se há página guardada
    const redirect = sessionStorage.getItem('redirect_after_login');
    
    if (redirect && redirect !== '/login.html') {
        sessionStorage.removeItem('redirect_after_login');
        window.location.href = redirect;
    } else {
        window.location.href = 'area-cliente.html';
    }
}

// ============================================
// INICIALIZAR SESSÃO NA PÁGINA
// ============================================
async function inicializarSessao() {
    console.log('🔄 Inicializando gestão de sessão...');
    
    // Configurar listener de mudanças
    configurarPersistenciaSessao();
    
    // Verificar sessão atual
    await verificarEAtualizarSessao();
    
    console.log('✅ Gestão de sessão inicializada');
}

// ============================================
// AUTO-INICIALIZAR
// ============================================
if (typeof supabase !== 'undefined') {
    // Se supabase já está disponível, inicializar imediatamente
    inicializarSessao();
} else {
    // Senão, esperar a página carregar
    window.addEventListener('load', () => {
        setTimeout(inicializarSessao, 500);
    });
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
window.sessionManager = {
    verificar: verificarEAtualizarSessao,
    logout: fazerLogoutCompleto,
    proteger: protegerPaginaComRedirect,
    redirecionar: redirecionarAposLogin,
    inicializar: inicializarSessao
};

console.log('✅ session.js carregado!');