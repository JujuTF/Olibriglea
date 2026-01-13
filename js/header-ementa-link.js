// ============================================
// 🔗 header-ementa-link.js
// Adiciona redirecionamento inteligente ao link "Ementa"
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Aguardar o header carregar
    await aguardarHeader();
    
    // Configurar link da ementa
    configurarLinkEmenta();
});

// Aguardar header ser carregado (via includes)
async function aguardarHeader() {
    return new Promise((resolve) => {
        const checkHeader = setInterval(() => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                clearInterval(checkHeader);
                resolve();
            }
        }, 100);
        
        // Timeout de segurança (5 segundos)
        setTimeout(() => {
            clearInterval(checkHeader);
            resolve();
        }, 5000);
    });
}

// Configurar link da ementa
function configurarLinkEmenta() {
    // Procurar o link "Ementa" no menu
    const navLinks = document.querySelectorAll('.nav-menu a');
    let linkEmenta = null;
    
    navLinks.forEach(link => {
        const texto = link.textContent.trim().toLowerCase();
        if (texto === 'ementa' || texto.includes('ementa')) {
            linkEmenta = link;
        }
    });
    
    if (!linkEmenta) {
        console.log('Link Ementa não encontrado no header');
        return;
    }
    
    // Adicionar evento de clique
    linkEmenta.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Verificar se supabase está disponível
        if (typeof supabase === 'undefined') {
            console.error('Supabase não está carregado');
            // Fallback: ir para página de ementa pública
            window.location.href = 'ementa-semanal.html';
            return;
        }
        
        try {
            // Buscar ementa publicada
            const { data, error } = await supabase
                .rpc('buscar_ementa_atual');
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                // Tem ementa publicada - ir para página de detalhe
                const ementaId = data[0].id;
                window.location.href = `backoffice-ementa-detalhe.html?id=${ementaId}`;
            } else {
                // Não tem ementa publicada - ir para página pública
                window.location.href = 'ementa-semanal.html';
            }
            
        } catch (error) {
            console.error('Erro ao buscar ementa:', error);
            // Fallback: ir para página de ementa pública
            window.location.href = 'ementa-semanal.html';
        }
    });
    
    console.log('✅ Link Ementa configurado com redirecionamento inteligente');
}

// Exportar para uso global
window.headerEmentaLink = {
    configurar: configurarLinkEmenta
};
