// ============================================
// 🎯 header.js - Lógica do Header
// ============================================

// ============================================
// VERIFICAR E ATUALIZAR BOTÃO ÁREA CLIENTE
// ============================================
async function verificarEAtualizarBotao() {
    const btnAreaCliente = document.getElementById('btnAreaCliente');
    
    if (!btnAreaCliente) return; // Se o botão não existe, sair
    
    try {
        // Verificar se há utilizador logado
        const user = await verificarSessao();
        
        if (user) {
            // Utilizador está logado - mudar texto e link
            btnAreaCliente.textContent = 'A Minha Conta';
            btnAreaCliente.href = 'area-cliente.html';
        } else {
            // Utilizador não está logado - manter como está
            btnAreaCliente.textContent = 'Iniciar Sessão';
            btnAreaCliente.href = 'login.html';
        }
    } catch (error) {
        // Em caso de erro, assumir que não está logado
        btnAreaCliente.textContent = 'Iniciar Sessão';
        btnAreaCliente.href = 'login.html';
    }
}

// ============================================
// EVENT LISTENER PARA O BOTÃO
// ============================================
function inicializarBotaoAreaCliente() {
    const btnAreaCliente = document.getElementById('btnAreaCliente');
    
    if (!btnAreaCliente) return;
    
    btnAreaCliente.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            const user = await verificarSessao();
            
            if (user) {
                // Redirecionar para área de cliente
                window.location.href = 'area-cliente.html';
            } else {
                // Redirecionar para login
                window.location.href = 'login.html';
            }
        } catch (error) {
            window.location.href = 'login.html';
        }
    });
}

// ============================================
// INICIALIZAR AO CARREGAR PÁGINA
// ============================================
window.addEventListener('load', async () => {
    await verificarEAtualizarBotao();
    inicializarBotaoAreaCliente();
});

// ============================================
// SUBSCREVER A MUDANÇAS DE AUTENTICAÇÃO
// ============================================
// Se o utilizador fizer logout/login em outra tab, atualizar
if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange(async (event, session) => {
        await verificarEAtualizarBotao();
    });
}