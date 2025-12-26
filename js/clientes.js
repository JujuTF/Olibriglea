// ============================================
// 👤 clientes.js - Gestão de Clientes
// ============================================

// ============================================
// BUSCAR DADOS DO CLIENTE LOGADO
// ============================================
async function buscarMeusDados() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error('Utilizador não autenticado');
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            cliente: data
        };

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// BUSCAR HISTÓRICO DO CLIENTE LOGADO
// ============================================
async function buscarMeuHistorico(limite = 20) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error('Utilizador não autenticado');
        }

        const { data, error } = await supabase
            .from('pontos_historico')
            .select('*')
            .eq('user_id', user.id)
            .order('data_criacao', { ascending: false })
            .limit(limite);

        if (error) throw error;

        return {
            sucesso: true,
            historico: data
        };

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// ATUALIZAR PERFIL
// ============================================
async function atualizarPerfil(dadosNovos) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error('Utilizador não autenticado');
        }

        // Atualizar dados na tabela users
        const { data, error } = await supabase
            .from('users')
            .update(dadosNovos)
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            cliente: data,
            mensagem: 'Perfil atualizado com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// RENDERIZAR CARTÃO DE PONTOS
// ============================================
function renderizarCartaoPontos(pontosAtuais) {
    const container = document.querySelector('.pontos-circles');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const circulo = document.createElement('div');
        circulo.className = 'ponto-circle';
        circulo.textContent = i;
        
        if (i <= pontosAtuais) {
            circulo.classList.add('filled');
        }
        
        container.appendChild(circulo);
    }

    // Atualizar contador
    const contador = document.querySelector('.pontos-count');
    if (contador) {
        contador.textContent = `${pontosAtuais}/10 pontos`;
    }

    // Atualizar barra de progresso
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = `${pontosAtuais * 10}%`;
    }

    // Atualizar mensagem
    const mensagem = document.querySelector('.pontos-message');
    if (mensagem) {
        const faltam = 10 - pontosAtuais;
        if (pontosAtuais === 10) {
            mensagem.innerHTML = '<strong>🎉 Lanche grátis disponível!</strong>';
        } else {
            mensagem.innerHTML = `Faltam <strong>${faltam} refeições</strong> para o seu lanche grátis! 🎯`;
        }
    }
}

// ============================================
// RENDERIZAR HISTÓRICO
// ============================================
function renderizarHistorico(historico) {
    const lista = document.querySelector('.historico-list');
    if (!lista) return;

    lista.innerHTML = '';

    historico.forEach(item => {
        const li = document.createElement('li');
        li.className = 'historico-item';

        const data = new Date(item.data_criacao).toLocaleDateString('pt-PT');
        
        li.innerHTML = `
            <span class="historico-date">${data}</span>
            <div class="historico-desc">${item.descricao || 'Refeição'}</div>
            <span class="historico-points">${item.quantidade > 0 ? '+' : ''}${item.quantidade}</span>
        `;

        lista.appendChild(li);
    });
}

// ============================================
// CARREGAR PÁGINA DA ÁREA DO CLIENTE
// ============================================
async function carregarAreaCliente() {
    try {
        // 1. Buscar dados do cliente
        const resultadoDados = await buscarMeusDados();
        
        if (!resultadoDados.sucesso) {
            throw new Error(resultadoDados.mensagem);
        }

        const cliente = resultadoDados.cliente;

        // 2. Atualizar UI com dados do cliente
        document.querySelector('.welcome-banner h1').textContent = 
            `Olá, ${cliente.nome} ${cliente.apelido}!`;
        
        document.querySelector('.user-code').textContent = cliente.codigo;

        // 3. Renderizar cartão de pontos
        renderizarCartaoPontos(cliente.pontos_atuais);

        // 4. Atualizar última refeição
        const ultimaRefeicao = document.querySelector('.ultima-refeicao');
        if (ultimaRefeicao && cliente.data_ultima_refeicao) {
            const data = new Date(cliente.data_ultima_refeicao).toLocaleDateString('pt-PT');
            ultimaRefeicao.textContent = `Última refeição: ${data}`;
        }

        // 5. Buscar e renderizar histórico
        const resultadoHistorico = await buscarMeuHistorico(5);
        
        if (resultadoHistorico.sucesso) {
            renderizarHistorico(resultadoHistorico.historico);
        }

        // 6. Verificar se tem 10 pontos
        if (cliente.pontos_atuais === 10) {
            // Redirecionar para página de celebração
            setTimeout(() => {
                const quer = confirm('🎉 Parabéns! Tem um lanche grátis disponível! Quer ver?');
                if (quer) {
                    window.location.href = '10-pontos-celebracao.html';
                }
            }, 1000);
        }

    } catch (error) {
        console.error('Erro ao carregar área do cliente:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
    }
}

// ============================================
// SUBSCREVER A ATUALIZAÇÕES EM TEMPO REAL
// ============================================
async function subscreverAtualizacoes() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // Ouvir mudanças na tabela users
    const subscription = supabase
        .channel('user-changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: `id=eq.${user.id}`
            },
            (payload) => {
                // Recarregar dados
                carregarAreaCliente();
            }
        )
        .subscribe();

    return subscription;
}

// ============================================
// EXEMPLO DE USO NO HTML
// ============================================

/*
// No area-cliente.html, adicionar no final antes de </body>:

<script src="js/config.js"></script>
<script src="js/auth.js"></script>
<script src="js/clientes.js"></script>
<script>
    window.addEventListener('load', async () => {
        // Verificar se está logado
        const user = await verificarSessao();
        
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Carregar dados do cliente
        await carregarAreaCliente();

        // Subscrever a atualizações (opcional)
        await subscreverAtualizacoes();
    });

    // Botão de logout
    document.querySelector('.btn-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        fazerLogout();
    });
</script>
*/
