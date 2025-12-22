// ============================================
// 🔐 auth.js - Autenticação com Validações
// ============================================

// ============================================
// VALIDAÇÕES
// ============================================
function validarEmail(email) {
    // Email deve ter @ e pelo menos um ponto no domínio
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarPassword(password) {
    // Password deve ter mínimo 6 caracteres
    return password && password.length >= 6;
}

function validarTelefone(telefone) {
    // Remover espaços e verificar se tem 9 dígitos
    const limpo = telefone.replace(/\s/g, '');
    return limpo.length === 9 && /^\d+$/.test(limpo);
}

// ============================================
// REGISTO DE NOVO CLIENTE (COM VALIDAÇÕES)
// ============================================
async function registarCliente(formData) {
    try {
        // VALIDAÇÕES
        if (!formData.nome || formData.nome.trim() === '') {
            return {
                sucesso: false,
                mensagem: 'Nome é obrigatório'
            };
        }

        if (!formData.apelido || formData.apelido.trim() === '') {
            return {
                sucesso: false,
                mensagem: 'Apelido é obrigatório'
            };
        }

        if (!validarEmail(formData.email)) {
            return {
                sucesso: false,
                mensagem: 'Email inválido! Use formato: exemplo@dominio.com'
            };
        }

        if (!validarPassword(formData.password)) {
            return {
                sucesso: false,
                mensagem: 'Password deve ter pelo menos 6 caracteres'
            };
        }

        if (!validarTelefone(formData.telefone)) {
            return {
                sucesso: false,
                mensagem: 'Telefone inválido! Use 9 dígitos (ex: 910123456)'
            };
        }

        // 1. Criar conta na autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email.trim().toLowerCase(),
            password: formData.password
        });

        if (authError) {
            console.error('Erro auth:', authError);
            
            // Mensagens de erro mais amigáveis
            if (authError.message.includes('already registered')) {
                return {
                    sucesso: false,
                    mensagem: 'Este email já está registado. Tente fazer login.'
                };
            }
            
            if (authError.message.includes('invalid')) {
                return {
                    sucesso: false,
                    mensagem: 'Email ou password inválidos'
                };
            }
            
            throw authError;
        }

        if (!authData.user) {
            throw new Error('Utilizador não foi criado');
        }

        // 2. Criar perfil na tabela users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                nome: formData.nome.trim(),
                apelido: formData.apelido.trim(),
                email: formData.email.trim().toLowerCase(),
                telefone: formData.telefone.replace(/\s/g, ''),
                newsletter: formData.newsletter || false
            })
            .select()
            .single();

        if (userError) {
            console.error('Erro user:', userError);
            
            // Se falhou criar perfil, tentar apagar autenticação
            // (para não ficar conta órfã)
            try {
                await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteErr) {
                console.error('Erro ao limpar:', deleteErr);
            }
            
            throw userError;
        }

        console.log('✅ Cliente criado:', userData);

        return {
            sucesso: true,
            codigo: userData.codigo,
            user: userData,
            mensagem: `Conta criada com sucesso! Seu código: ${userData.codigo}`
        };

    } catch (error) {
        console.error('❌ Erro no registo:', error);
        return {
            sucesso: false,
            mensagem: error.message || 'Erro ao criar conta. Tente novamente.'
        };
    }
}

// ============================================
// LOGIN (COM VALIDAÇÕES)
// ============================================
async function fazerLogin(email, password) {
    try {
        // Validações
        if (!validarEmail(email)) {
            return {
                sucesso: false,
                mensagem: 'Email inválido'
            };
        }

        if (!validarPassword(password)) {
            return {
                sucesso: false,
                mensagem: 'Password deve ter pelo menos 6 caracteres'
            };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: password
        });

        if (error) {
            console.error('Erro login:', error);
            
            if (error.message.includes('Invalid')) {
                return {
                    sucesso: false,
                    mensagem: 'Email ou password incorretos'
                };
            }
            
            throw error;
        }

        console.log('✅ Login bem-sucedido:', data.user.email);
        
        // Atualizar UI se session.js estiver carregado
        if (window.sessionManager) {
            await window.sessionManager.verificar();
        }

        return {
            sucesso: true,
            user: data.user
        };

    } catch (error) {
        console.error('❌ Erro no login:', error);
        return {
            sucesso: false,
            mensagem: 'Erro ao fazer login. Verifique os dados e tente novamente.'
        };
    }
}

// ============================================
// LOGOUT
// ============================================
async function fazerLogout() {
    // Usar o sistema de sessão se disponível
    if (window.sessionManager) {
        return await window.sessionManager.logout();
    }
    
    // Fallback se session.js não estiver carregado
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        console.log('✅ Logout bem-sucedido');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('❌ Erro no logout:', error);
        // Mesmo com erro, redirecionar
        window.location.href = 'index.html';
    }
}

// ============================================
// VERIFICAR SE ESTÁ LOGADO
// ============================================
async function verificarSessao() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            return null;
        }
        
        return user;

    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        return null;
    }
}

// ============================================
// RECUPERAR PASSWORD
// ============================================
async function recuperarPassword(email) {
    try {
        if (!validarEmail(email)) {
            return {
                sucesso: false,
                mensagem: 'Email inválido'
            };
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
                redirectTo: `${window.location.origin}/recuperar-password.html?reset=true`
            }
        );

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Email de recuperação enviado! Verifique a sua caixa de entrada.'
        };

    } catch (error) {
        console.error('❌ Erro ao recuperar password:', error);
        return {
            sucesso: false,
            mensagem: 'Erro ao enviar email de recuperação. Verifique o email e tente novamente.'
        };
    }
}

// ============================================
// REDEFINIR PASSWORD
// ============================================
async function redefinirPassword(novaPassword) {
    try {
        if (!validarPassword(novaPassword)) {
            return {
                sucesso: false,
                mensagem: 'Password deve ter pelo menos 6 caracteres'
            };
        }

        const { error } = await supabase.auth.updateUser({
            password: novaPassword
        });

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Password redefinida com sucesso!'
        };

    } catch (error) {
        console.error('❌ Erro ao redefinir password:', error);
        return {
            sucesso: false,
            mensagem: 'Erro ao redefinir password. Tente novamente.'
        };
    }
}

// ============================================
// PROTEGER PÁGINA (só utilizadores logados)
// ============================================
async function protegerPagina() {
    const user = await verificarSessao();
    
    if (!user) {
        alert('Precisa de fazer login primeiro!');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ============================================
// OBTER DADOS DO UTILIZADOR ATUAL
// ============================================
async function obterUtilizadorAtual() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) return null;

        // Buscar dados completos da tabela users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (userError) throw userError;

        return userData;

    } catch (error) {
        console.error('❌ Erro ao obter utilizador:', error);
        return null;
    }
}

// ============================================
// DEBUG / TESTES
// ============================================
console.log('✅ auth.js carregado com validações!');