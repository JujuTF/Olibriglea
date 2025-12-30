// ============================================
// ⭐ pontos.js - Gestão de Pontos (CORRIGIDO FINAL)
// ============================================

// NOTA: O campo 'tipo' deve ser 'adicionar' (não 'adicao')
// Conforme o CHECK constraint: 'adicionar', 'resgatar', 'ajuste'

// ============================================
// PESQUISAR CLIENTE
// ============================================
async function pesquisarCliente(termo) {
    try {
        const { data, error } = await supabase
            .rpc('buscar_cliente', { p_termo: termo });

        if (error) throw error;

        return {
            sucesso: true,
            clientes: data
        };

    } catch (error) {
        console.error('Erro ao pesquisar:', error);
        return {
            sucesso: false,
            mensagem: error.message,
            clientes: []
        };
    }
}

// ============================================
// ADICIONAR PONTO (CORRIGIDO FINAL)
// ============================================
async function adicionarPonto(userId, descricao = 'Refeição', criadoPor = 'sistema') {
    try {
        const { data, error } = await supabase.rpc('adicionar_ponto', {
            p_user_id: userId,
            p_descricao: descricao,
            p_criado_por: criadoPor,
            p_tipo: 'adicionar' // ✅ CORRETO: 'adicionar' (não 'adicao')
        });

        if (error) throw error;

        return {
            sucesso: true,
            resultado: data
        };

    } catch (error) {
        console.error('Erro ao adicionar ponto:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// RESGATAR LANCHE
// ============================================
async function resgatarLanche(userId, criadoPor = 'sistema') {
    try {
        const { data, error } = await supabase.rpc('resgatar_lanche', {
            p_user_id: userId,
            p_criado_por: criadoPor
        });

        if (error) throw error;

        return {
            sucesso: true,
            resultado: data
        };

    } catch (error) {
        console.error('Erro ao resgatar lanche:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// BUSCAR CLIENTES PRÓXIMOS DO RESGATE
// ============================================
async function buscarClientesProximos() {
    try {
        const { data, error } = await supabase
            .rpc('clientes_proximos_resgate');

        if (error) throw error;

        return {
            sucesso: true,
            clientes: data
        };

    } catch (error) {
        console.error('Erro ao buscar clientes próximos:', error);
        return {
            sucesso: false,
            mensagem: error.message,
            clientes: []
        };
    }
}

// ============================================
// BUSCAR ESTATÍSTICAS DO DASHBOARD
// ============================================
async function buscarEstatisticas() {
    try {
        const { data, error } = await supabase
            .from('dashboard_stats')
            .select('*')
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            stats: data
        };

    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// RENDERIZAR CLIENTE NO BACKOFFICE
// ============================================
function renderizarClienteBackoffice(cliente) {
    const resultCard = document.getElementById('resultCard');
    if (!resultCard) return;

    resultCard.innerHTML = `
        <!-- Âncora para scroll -->
        <div id="resultadoPesquisa"></div>
        
        <h3>Resultado da Pesquisa</h3>
        <div class="cliente-info-card">
            <div class="cliente-header">
                <div class="cliente-details">
                    <div class="cliente-codigo">${cliente.codigo}</div>
                    <h4>${cliente.nome_completo}</h4>
                    <ul class="cliente-contatos">
                        <li>📞 ${cliente.telefone}</li>
                        <li>✉️ ${cliente.email}</li>
                    </ul>
                    <div class="cliente-desde">
                        Cliente desde: ${new Date(cliente.data_registo || Date.now()).toLocaleDateString('pt-PT')}
                    </div>
                </div>
            </div>

            <div class="pontos-display-bo">
                <h5>Pontos Atuais:</h5>
                <div class="pontos-circles-bo">
                    ${Array.from({ length: 10 }, (_, i) => `
                        <div class="ponto-circle-bo ${i < cliente.pontos_atuais ? 'filled' : 'empty'}">
                            ${i + 1}
                        </div>
                    `).join('')}
                </div>
                <div class="pontos-text">${cliente.pontos_atuais}/10 pontos</div>
                ${cliente.data_ultima_refeicao ? `
                    <div class="ultima-refeicao">
                        Última refeição: ${new Date(cliente.data_ultima_refeicao).toLocaleDateString('pt-PT')}
                    </div>
                ` : ''}
            </div>

            <div class="actions-row">
                <button class="btn btn-add" onclick="mostrarModalAdicionarPonto('${cliente.id}', '${cliente.codigo}', '${cliente.nome_completo}', ${cliente.pontos_atuais})">
                    ➕ Adicionar Ponto
                </button>
            </div>
        </div>
    `;

    resultCard.style.display = 'block';
    
    // Guardar dados do cliente no elemento
    resultCard.dataset.clienteId = cliente.id;
    resultCard.dataset.clienteCodigo = cliente.codigo;
    resultCard.dataset.clienteNome = cliente.nome_completo;
    resultCard.dataset.pontosAtuais = cliente.pontos_atuais;

    // ✅ SCROLL SUAVE ATÉ O RESULTADO
    setTimeout(() => {
        const ancora = document.getElementById('resultadoPesquisa');
        if (ancora) {
            ancora.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        }
    }, 100); // Pequeno delay para garantir que o conteúdo foi renderizado
}

// ============================================
// MODAL: ADICIONAR PONTO
// ============================================
function mostrarModalAdicionarPonto(userId, codigo, nome, pontosAtuais) {
    const modal = document.getElementById('modalAdicionar');
    if (!modal) return;

    // Verificar se já tem 10 pontos
    if (pontosAtuais >= 10) {
        alert('Este cliente já tem 10 pontos! Deve resgatar o lanche antes de adicionar mais.');
        return;
    }

    // Atualizar conteúdo do modal
    modal.querySelector('.modal-body').innerHTML = `
        <p><strong>Cliente:</strong> ${codigo} - ${nome}</p>
        <p><strong>Pontos atuais:</strong> ${pontosAtuais}/10</p>
        <div class="info-box-modal">
            Tem a certeza que quer adicionar <strong>1 ponto</strong> a este cliente?<br><br>
            <strong>Após adicionar:</strong> ${pontosAtuais + 1}/10 pontos
        </div>
    `;

    // Guardar dados no botão confirmar
    const btnConfirmar = modal.querySelector('.btn-confirm');
    btnConfirmar.onclick = () => confirmarAdicionarPonto(userId, codigo, nome, pontosAtuais);

    modal.classList.add('show');
}

// ============================================
// CONFIRMAR ADICIONAR PONTO
// ============================================
async function confirmarAdicionarPonto(userId, codigo, nome, pontosAtuais) {
    // Fechar modal de confirmação
    document.getElementById('modalAdicionar').classList.remove('show');

    try {
        // Buscar nome do staff logado
        const { data: { user } } = await supabase.auth.getUser();
        let criadoPor = 'sistema';
        
        if (user) {
            const { data: staff } = await supabase
                .from('backoffice_users')
                .select('nome')
                .eq('id', user.id)
                .single();
            
            if (staff) {
                criadoPor = staff.nome.toLowerCase();
            }
        }

        // Adicionar ponto
        const resultado = await adicionarPonto(userId, 'Refeição', criadoPor);

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem);
        }

        // Mostrar modal de sucesso
        mostrarModalSucesso(codigo, nome, resultado.resultado);

    } catch (error) {
        console.error('Erro completo:', error);
        alert('Erro ao adicionar ponto: ' + error.message);
    }
}

// ============================================
// MODAL: SUCESSO
// ============================================
function mostrarModalSucesso(codigo, nome, resultado) {
    const modal = document.getElementById('modalSucesso');
    if (!modal) return;

    const pontosAnteriores = resultado.pontos_antes;
    const pontosNovos = resultado.pontos_depois;
    const atingiu10 = resultado.atingiu_10_pontos;

    modal.querySelector('.modal-body').innerHTML = `
        <p><strong>Cliente:</strong> ${codigo} - ${nome}</p>
        <div class="info-box-modal">
            <span style="color: #999;">Pontos anteriores:</span> <strong>${pontosAnteriores}/10</strong><br>
            <span style="color: var(--verde);">Pontos atuais:</span> <strong style="color: var(--verde);">${pontosNovos}/10</strong>
        </div>
        <p style="margin-top: 1rem; color: ${atingiu10 ? 'var(--dourado)' : 'var(--azul)'}; font-weight: 600;">
            ${atingiu10 
                ? '🎉 Cliente completou 10 pontos! Lanche grátis disponível!' 
                : `Faltam ${10 - pontosNovos} pontos para o lanche grátis!`
            }
        </p>
    `;

    modal.classList.add('show');
}

// ============================================
// FECHAR MODAL SUCESSO E RECARREGAR
// ============================================
function fecharModalSucesso() {
    document.getElementById('modalSucesso').classList.remove('show');
    
    // Recarregar a pesquisa para atualizar os dados
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        executarPesquisa(searchInput.value);
    }
    
    // Atualizar estatísticas
    carregarEstatisticas();
}

// ============================================
// EXECUTAR PESQUISA
// ============================================
async function executarPesquisa(termo) {
    if (!termo || termo.trim() === '') {
        alert('Por favor, introduza um termo de pesquisa');
        return;
    }

    try {
        const resultado = await pesquisarCliente(termo.trim());

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem);
        }

        if (resultado.clientes.length === 0) {
            alert('Nenhum cliente encontrado');
            document.getElementById('resultCard').style.display = 'none';
            return;
        }

        // Se encontrou apenas 1, mostrar diretamente
        if (resultado.clientes.length === 1) {
            renderizarClienteBackoffice(resultado.clientes[0]);
        } else {
            // Se encontrou vários, mostrar lista para escolher
            mostrarListaClientes(resultado.clientes);
        }

    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao pesquisar: ' + error.message);
    }
}

// ============================================
// CARREGAR ESTATÍSTICAS DO DASHBOARD
// ============================================
async function carregarEstatisticas() {
    try {
        const resultado = await buscarEstatisticas();

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem);
        }

        const stats = resultado.stats;

        // Atualizar cards de estatísticas
        const statRefeicoes = document.getElementById('statRefeicoes');
        const statPontos = document.getElementById('statPontos');
        const statProximos = document.getElementById('statProximos');

        if (statRefeicoes) statRefeicoes.textContent = stats.refeicoes_hoje || 0;
        if (statPontos) statPontos.textContent = stats.total_pontos_sistema || 0;
        if (statProximos) statProximos.textContent = stats.clientes_proximos_resgate || 0;

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// ============================================
// CARREGAR CLIENTES PRÓXIMOS
// ============================================
async function carregarClientesProximos() {
    try {
        const resultado = await buscarClientesProximos();

        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem);
        }

        renderizarClientesProximos(resultado.clientes);

    } catch (error) {
        console.error('Erro ao carregar clientes próximos:', error);
    }
}

// ============================================
// RENDERIZAR LISTA DE CLIENTES PRÓXIMOS
// ============================================
function renderizarClientesProximos(clientes) {
    const container = document.getElementById('listaClientesProximos');
    if (!container) return;

    container.innerHTML = '';

    if (clientes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Nenhum cliente próximo do resgate</p>';
        return;
    }

    clientes.forEach(cliente => {
        const item = document.createElement('div');
        item.className = 'cliente-item';
        
        // ✅ Scroll suave ao clicar
        item.onclick = () => {
            // Primeiro, fazer scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Depois executar pesquisa
            setTimeout(() => {
                executarPesquisa(cliente.codigo);
            }, 300);
        };
        
        item.innerHTML = `
            <div class="cliente-item-info">
                <div class="cliente-item-nome">${cliente.nome_completo}</div>
                <div class="cliente-item-codigo">${cliente.codigo}</div>
            </div>
            <div class="pontos-mini-display">
                ${Array.from({ length: 10 }, (_, i) => `
                    <div class="ponto-mini ${i < cliente.pontos_atuais ? 'filled' : ''}"></div>
                `).join('')}
            </div>
            <div class="pontos-count-display">${cliente.pontos_atuais}/10</div>
        `;

        container.appendChild(item);
    });
}