// ============================================
// 🔐 auth.js - Autenticação
// ============================================

// ============================================
// REGISTO DE NOVO CLIENTE
// ============================================
async function registarCliente(formData) {
    try {
        // 1. Criar conta na autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (authError) throw authError;

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

        if (userError) throw userError;

        console.log('Cliente criado:', userData);

        return {
            sucesso: true,
            codigo: userData.codigo,
            mensagem: `Conta criada com sucesso! Seu código: ${userData.codigo}`
        };

    } catch (error) {
        console.error('Erro no registo:', error);
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
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        console.log('Login bem-sucedido:', data.user);

        return {
            sucesso: true,
            user: data.user
        };

    } catch (error) {
        console.error('Erro no login:', error);
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
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        console.log('Logout bem-sucedido');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

// ============================================
// VERIFICAR SE ESTÁ LOGADO
// ============================================
async function verificarSessao() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user; // null se não estiver logado

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return null;
    }
}

// ============================================
// RECUPERAR PASSWORD
// ============================================
async function recuperarPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/recuperar-password.html?reset=true`
        });

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Email de recuperação enviado! Verifique a sua caixa de entrada.'
        };

    } catch (error) {
        console.error('Erro ao recuperar password:', error);
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
        const { error } = await supabase.auth.updateUser({
            password: novaPassword
        });

        if (error) throw error;

        return {
            sucesso: true,
            mensagem: 'Password redefinida com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao redefinir password:', error);
        return {
            sucesso: false,
            mensagem: error.message
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
// EXEMPLO DE USO NO HTML
// ============================================

/*
// No registo.html:
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('firstName').value,
        apelido: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    const resultado = await registarCliente(formData);
    
    if (resultado.sucesso) {
        // Mostrar modal de sucesso com o código
        document.getElementById('codigoCliente').textContent = resultado.codigo;
        document.getElementById('successModal').classList.add('show');
    } else {
        alert(resultado.mensagem);
    }
});

// No login.html:
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const resultado = await fazerLogin(email, password);
    
    if (resultado.sucesso) {
        window.location.href = 'area-cliente.html';
    } else {
        alert(resultado.mensagem);
    }
});

// Na área do cliente (proteção):
window.addEventListener('load', async () => {
    const isLogado = await protegerPagina();
    if (isLogado) {
        carregarDadosCliente();
    }
});
*/
