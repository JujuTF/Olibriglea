// ============================================
// 🔐 auth.js - Autenticação (VERSÃO CORRIGIDA)
// ============================================


// ============================================
// REGISTO DE NOVO CLIENTE
// ============================================
async function registarCliente(formData) {
    try {
        
        // Verificar se supabase existe
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase não está inicializado');
        }
        
        // 1. Criar conta na autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (authError) {
            console.error('❌ Erro auth:', authError);
            throw authError;
        }


        // 2. Criar perfil na tabela users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                nome: formData.nome,
                apelido: formData.apelido,
                email: formData.email,
                telefone: formData.telefone,
                newsletter: formData.newsletter || false
            })
            .select()
            .single();

        if (userError) {
            console.error('❌ Erro user:', userError);
            throw userError;
        }


        return {
            sucesso: true,
            codigo: userData.codigo,
            mensagem: `Conta criada com sucesso! Seu código: ${userData.codigo}`
        };

    } catch (error) {
        console.error('❌ Erro no registo:', error);
        return {
            sucesso: false,
            mensagem: error.message || 'Erro ao criar conta'
        };
    }
}

// ============================================
// LOGIN
// ============================================
async function fazerLogin(email, password) {
    try {
        
        // Verificar se supabase existe
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase não está inicializado');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }

        return {
            sucesso: true,
            user: data.user
        };

    } catch (error) {
        console.error('❌ Erro no login:', error);
        return {
            sucesso: false,
            mensagem: 'Email ou password incorretos'
        };
    }
}

// ============================================
// LOGOUT
// ============================================
async function fazerLogout() {
    try {
        
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase não está inicializado');
        }
        
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        window.location.href = 'index.html';

    } catch (error) {
        console.error('❌ Erro no logout:', error);
        alert('Erro ao sair. Tente novamente.');
    }
}

// ============================================
// VERIFICAR SE ESTÁ LOGADO
// ============================================
async function verificarSessao() {
    try {
        // Verificar se supabase existe
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase não está disponível em verificarSessao');
            return null;
        }
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('❌ Erro ao verificar sessão:', error);
            return null;
        }
        
        return user; // null se não estiver logado

    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        return null;
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
// RECUPERAR PASSWORD
// ============================================
async function recuperarPassword(email) {
    try {
        
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase não está inicializado');
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/recuperar-password.html?reset=true`
        });

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Email de recuperação enviado! Verifique a sua caixa de entrada.'
        };

    } catch (error) {
        console.error('❌ Erro ao recuperar password:', error);
        return {
            sucesso: false,
            mensagem: error.message
        };
    }
}

// ============================================
// REDEFINIR PASSWORD
// ============================================
async function redefinirPassword(novaPassword) {
    try {
        
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase não está inicializado');
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
            mensagem: error.message
        };
    }
}

// ============================================
// EXPORTAR FUNÇÕES - DIRETAMENTE PARA WINDOW
// ============================================
// Tornar funções disponíveis globalmente
window.registarCliente = registarCliente;
window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.verificarSessao = verificarSessao;
window.protegerPagina = protegerPagina;
window.recuperarPassword = recuperarPassword;
window.redefinirPassword = redefinirPassword;

// Também manter o objeto authFunctions para compatibilidade
window.authFunctions = {
    registarCliente,
    fazerLogin,
    fazerLogout,
    verificarSessao,
    protegerPagina,
    recuperarPassword,
    redefinirPassword
};
