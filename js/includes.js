// ============================================
// 📦 includes.js - Sistema de Includes HTML
// ============================================

/*
    Este sistema permite incluir ficheiros HTML dentro de outros.
    Similar ao PHP include ou ASP.NET partials.
    
    USO:
    <div data-include="components/header.html"></div>
    <div data-include="components/footer.html"></div>
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
        elemento.innerHTML = html;
        
        console.log(`✅ Carregado: ${arquivo}`);
        
    } catch (erro) {
        console.error(`❌ Erro ao carregar ${arquivo}:`, erro);
        elemento.innerHTML = `<!-- Erro ao carregar ${arquivo} -->`;
    }
}

// ============================================
// PROCESSAR TODOS OS INCLUDES
// ============================================
async function processarIncludes() {
    console.log('📦 Processando includes...');
    
    const elementos = document.querySelectorAll('[data-include]');
    
    if (elementos.length === 0) {
        console.log('ℹ️ Nenhum include encontrado');
        return;
    }
    
    console.log(`📦 Encontrados ${elementos.length} includes`);
    
    // Carregar todos em paralelo
    await Promise.all(
        Array.from(elementos).map(elemento => carregarInclude(elemento))
    );
    
    console.log('✅ Todos os includes processados!');
    
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

console.log('✅ includes.js carregado!');