// ============================================
// 🍽️ ementas.js - Gestão de Ementas Semanais
// ============================================

console.log('📦 ementas.js carregado');

// ============================================
// BUSCAR EMENTA ATUAL (Pública)
// ============================================
async function buscarEmentaAtual() {
    try {
        const { data, error } = await supabase
            .rpc('buscar_ementa_atual');

        if (error) throw error;

        return {
            sucesso: true,
            ementa: data && data.length > 0 ? data[0] : null
        };

    } catch (error) {
        console.error('Erro ao buscar ementa atual:', error);
        return {
            sucesso: false,
            mensagem: error.message,
            ementa: null
        };
    }
}

// ============================================
// LISTAR EMENTAS (Backoffice)
// ============================================
async function listarEmentas(limite = 10) {
    try {
        const { data, error } = await supabase
            .rpc('listar_ementas', { p_limite: limite });

        if (error) throw error;

        return {
            sucesso: true,
            ementas: data || []
        };

    } catch (error) {
        console.error('Erro ao listar ementas:', error);
        return {
            sucesso: false,
            mensagem: error.message,
            ementas: []
        };
    }
}

// ============================================
// BUSCAR EMENTA POR ID (Backoffice)
// ============================================
async function buscarEmentaPorId(ementaId) {
    try {
        const { data, error } = await supabase
            .rpc('buscar_ementa_por_id', { p_ementa_id: ementaId });

        if (error) throw error;

        return {
            sucesso: true,
            ementa: data && data.length > 0 ? data[0] : null
        };

    } catch (error) {
        console.error('Erro ao buscar ementa:', error);
        return {
            sucesso: false,
            mensagem: error.message,
            ementa: null
        };
    }
}

// ============================================
// CRIAR EMENTA (Backoffice)
// ============================================
async function criarEmenta(dadosEmenta) {
    try {
        // Buscar ID do staff logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error('Utilizador não autenticado');
        }

        const { data, error } = await supabase
            .from('ementas_semanais')
            .insert({
                ...dadosEmenta,
                criado_por: user.id
            })
            .select()
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            ementa: data,
            mensagem: 'Ementa criada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao criar ementa:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// ATUALIZAR EMENTA (Backoffice)
// ============================================
async function atualizarEmenta(ementaId, dadosEmenta) {
    try {
        const { data, error } = await supabase
            .from('ementas_semanais')
            .update(dadosEmenta)
            .eq('id', ementaId)
            .select()
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            ementa: data,
            mensagem: 'Ementa atualizada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao atualizar ementa:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// PUBLICAR/DESPUBLICAR EMENTA
// ============================================
async function togglePublicacaoEmenta(ementaId, publicar = true) {
    try {
        const { data, error } = await supabase
            .from('ementas_semanais')
            .update({ publicado: publicar })
            .eq('id', ementaId)
            .select()
            .single();

        if (error) throw error;

        return {
            sucesso: true,
            ementa: data,
            mensagem: publicar ? 'Ementa publicada!' : 'Ementa despublicada'
        };

    } catch (error) {
        console.error('Erro ao atualizar publicação:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// DELETAR EMENTA (Backoffice)
// ============================================
async function deletarEmenta(ementaId) {
    try {
        const { error } = await supabase
            .from('ementas_semanais')
            .delete()
            .eq('id', ementaId);

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Ementa eliminada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao deletar ementa:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// RENDERIZAR EMENTA (Página Pública)
// ============================================
function renderizarEmenta(ementa) {
    if (!ementa) {
        return '<div class="ementa-vazia">Nenhuma ementa disponível esta semana</div>';
    }

    const diasSemana = [
        { nome: 'Segunda-feira', sopa: ementa.segunda_sopa, pratos: ementa.segunda_pratos },
        { nome: 'Terça-feira', sopa: ementa.terca_sopa, pratos: ementa.terca_pratos },
        { nome: 'Quarta-feira', sopa: ementa.quarta_sopa, pratos: ementa.quarta_pratos },
        { nome: 'Quinta-feira', sopa: ementa.quinta_sopa, pratos: ementa.quinta_pratos },
        { nome: 'Sexta-feira', sopa: ementa.sexta_sopa, pratos: ementa.sexta_pratos }
    ];

    let html = '<div class="ementa-container">';
    
    // Header com datas
    const inicio = new Date(ementa.semana_inicio);
    const fim = new Date(ementa.semana_fim);
    html += `
        <div class="ementa-header">
            <h2>Ementa Semanal</h2>
            <p class="ementa-periodo">
                ${inicio.toLocaleDateString('pt-PT')} - ${fim.toLocaleDateString('pt-PT')}
            </p>
        </div>
    `;

    // Dias da semana
    diasSemana.forEach(dia => {
        if (dia.sopa || (dia.pratos && dia.pratos.length > 0)) {
            html += `
                <div class="ementa-dia">
                    <h3 class="dia-nome">${dia.nome}</h3>
                    
                    ${dia.sopa ? `
                        <div class="ementa-item">
                            <strong>Sopa:</strong> ${dia.sopa}
                        </div>
                    ` : ''}
                    
                    ${dia.pratos && dia.pratos.length > 0 ? `
                        <div class="ementa-pratos">
                            <ul>
                                ${dia.pratos.map(prato => `<li>${prato}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });

    html += '</div>';
    return html;
}

// ============================================
// GERAR IMAGEM PARA INSTAGRAM
// ============================================
async function gerarImagemInstagram(ementa) {
    return new Promise((resolve) => {
        // Criar canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensões Instagram (quadrado)
        canvas.width = 1080;
        canvas.height = 1080;
        
        // Background azul
        ctx.fillStyle = '#1a1464';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Título
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 60px Cormorant Garamond';
        ctx.textAlign = 'center';
        ctx.fillText('MENU DA SEMANA', canvas.width / 2, 100);
        
        // Datas
        const inicio = new Date(ementa.semana_inicio);
        const fim = new Date(ementa.semana_fim);
        ctx.font = '30px Lora';
        ctx.fillText(
            `${inicio.toLocaleDateString('pt-PT')} - ${fim.toLocaleDateString('pt-PT')}`,
            canvas.width / 2,
            150
        );
        
        // Dias da semana
        const diasSemana = [
            { nome: 'segunda-feira', sopa: ementa.segunda_sopa, pratos: ementa.segunda_pratos },
            { nome: 'terça-feira', sopa: ementa.terca_sopa, pratos: ementa.terca_pratos },
            { nome: 'quarta-feira', sopa: ementa.quarta_sopa, pratos: ementa.quarta_pratos },
            { nome: 'quinta-feira', sopa: ementa.quinta_sopa, pratos: ementa.quinta_pratos },
            { nome: 'sexta-feira', sopa: ementa.sexta_sopa, pratos: ementa.sexta_pratos }
        ];
        
        let yPos = 220;
        
        diasSemana.forEach(dia => {
            if (dia.sopa || (dia.pratos && dia.pratos.length > 0)) {
                // Nome do dia (dourado)
                ctx.fillStyle = '#B8860B';
                ctx.font = 'italic 36px Cormorant Garamond';
                ctx.textAlign = 'center';
                ctx.fillText(dia.nome, canvas.width / 2, yPos);
                yPos += 40;
                
                // Sopa e pratos (branco, mais pequeno)
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '22px Lora';
                ctx.textAlign = 'left';
                
                const texto = `Sopa: ${dia.sopa || 'N/A'} | ${dia.pratos ? dia.pratos.join(' | ') : ''}`;
                
                // Quebrar texto em linhas se muito longo
                const maxWidth = 950;
                const palavras = texto.split(' ');
                let linha = '';
                
                palavras.forEach(palavra => {
                    const testeLinanha = linha + palavra + ' ';
                    const metricas = ctx.measureText(testeLinanha);
                    
                    if (metricas.width > maxWidth && linha !== '') {
                        ctx.fillText(linha, 65, yPos);
                        yPos += 28;
                        linha = palavra + ' ';
                    } else {
                        linha = testeLinanha;
                    }
                });
                
                ctx.fillText(linha, 65, yPos);
                yPos += 45;
            }
        });
        
        // Logo/Footer
        ctx.fillStyle = '#B8860B';
        ctx.font = 'bold 40px Cormorant Garamond';
        ctx.textAlign = 'center';
        ctx.fillText('Olibriglea', canvas.width / 2, canvas.height - 60);
        
        // Converter para blob
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}

// ============================================
// DOWNLOAD IMAGEM INSTAGRAM
// ============================================
async function downloadImagemInstagram(ementa) {
    try {
        const blob = await gerarImagemInstagram(ementa);
        
        // Criar link de download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ementa-${ementa.semana_inicio}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return {
            sucesso: true,
            mensagem: 'Imagem descarregada com sucesso!'
        };
        
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
window.ementasFunctions = {
    buscarEmentaAtual,
    listarEmentas,
    buscarEmentaPorId,
    criarEmenta,
    atualizarEmenta,
    togglePublicacaoEmenta,
    deletarEmenta,
    renderizarEmenta,
    gerarImagemInstagram,
    downloadImagemInstagram
};

console.log('✅ ementas.js pronto');
