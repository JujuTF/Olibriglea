// ============================================
// 🔐 auth.js - Autenticação (VERSÃO LIMPA)
// ============================================

// IMPORTANTE: Este ficheiro APENAS define funções
// NÃO executa NADA automaticamente

console.log('📦 auth.js carregado');

// ============================================
// REGISTO DE NOVO CLIENTE
// ============================================
async function registarCliente(formData) {
    try {
        console.log('📝 Registando cliente:', formData.email);
        
        // 1. Criar conta na autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (authError) {
            console.error('❌ Erro auth:', authError);
            throw authError;
        }

        console.log('✅ Conta de autenticação criada');

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

        console.log('✅ Perfil criado:', userData);

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
        console.log('🔐 Fazendo login:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }

        console.log('✅ Login bem-sucedido:', data.user.email);

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
        console.log('👋 Fazendo logout...');
        
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;

        console.log('✅ Logout bem-sucedido');
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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            console.log('✅ Utilizador logado:', user.email);
        } else {
            console.log('ℹ️ Nenhum utilizador logado');
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
    console.log('🔒 Verificando acesso à página...');
    
    const user = await verificarSessao();
    
    if (!user) {
        console.log('⛔ Acesso negado - redirecionando para login');
        alert('Precisa de fazer login primeiro!');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('✅ Acesso permitido');
    return true;
}

// ============================================
// RECUPERAR PASSWORD
// ============================================
async function recuperarPassword(email) {
    try {
        console.log('📧 Enviando email de recuperação para:', email);
        
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
        console.log('🔑 Redefinindo password...');
        
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
// EXPORTAR FUNÇÕES
// ============================================
window.authFunctions = {
    registarCliente,
    fazerLogin,
    fazerLogout,
    verificarSessao,
    protegerPagina,
    recuperarPassword,
    redefinirPassword
};

console.log('✅ auth.js pronto (funções disponíveis)');

// ============================================
// NÃO EXECUTA NADA AUTOMATICAMENTE!
// ============================================
// As páginas devem chamar as funções quando necessário