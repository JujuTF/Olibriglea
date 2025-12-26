// ============================================
// 📦 includes.js - Sistema de Includes HTML (CORRIGIDO)
// ============================================

/*
    Este sistema permite incluir ficheiros HTML dentro de outros.
    Similar ao PHP include ou ASP.NET partials.
    
    USO:
    <div data-include="components/header.html"></div>
    <div data-include="components/footer.html"></div>
    
    CORREÇÃO: Agora executa scripts dentro dos ficheiros incluídos!
*/

// ============================================
// CARREGAR E INSERIR HTML
// ============================================
async function carregarInclude(elemento) {
    const arquivo = elemento.getAttribute('data-include');
    
    if (!arquivo) {
        console.warn('Elemento sem data-include:', elemento);
        return;
    }
    
    try {
        const resposta = await fetch(arquivo);
        
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar ${arquivo}: ${resposta.status}`);
        }
        
        const html = await resposta.text();
        
        // Inserir HTML
        elemento.innerHTML = html;
        
        // IMPORTANTE: Executar scripts manualmente
        // porque innerHTML não executa <script> tags
        executarScripts(elemento);
        
    } catch (erro) {
        console.error(`❌ Erro ao carregar ${arquivo}:`, erro);
        elemento.innerHTML = `<!-- Erro ao carregar ${arquivo} -->`;
    }
}

// ============================================
// EXECUTAR SCRIPTS DO HTML INCLUÍDO
// ============================================
function executarScripts(elemento) {
    const scripts = elemento.querySelectorAll('script');
    
    scripts.forEach((scriptAntigo, index) => {
        // Criar novo script (os antigos não executam)
        const scriptNovo = document.createElement('script');
        
        // Copiar atributos (src, type, etc.)
        Array.from(scriptAntigo.attributes).forEach(attr => {
            scriptNovo.setAttribute(attr.name, attr.value);
        });
        
        // Copiar código inline
        scriptNovo.textContent = scriptAntigo.textContent;
        
        // Substituir script antigo pelo novo
        scriptAntigo.parentNode.replaceChild(scriptNovo, scriptAntigo);
    });
}

// ============================================
// PROCESSAR TODOS OS INCLUDES
// ============================================
async function processarIncludes() {
    
    const elementos = document.querySelectorAll('[data-include]');
    
    if (elementos.length === 0) {
        return;
    }
    
    // Carregar todos em paralelo
    await Promise.all(
        Array.from(elementos).map(elemento => carregarInclude(elemento))
    );
    
    
    // Disparar evento customizado
    document.dispatchEvent(new Event('includesCarregados'));
}

// ============================================
// INICIALIZAR SISTEMA
// ============================================
function inicializarIncludes() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processarIncludes);
    } else {
        processarIncludes();
    }
}

// Auto-inicializar
inicializarIncludes();

// Exportar para uso manual
window.includes = {
    processar: processarIncludes,
    carregar: carregarInclude
};