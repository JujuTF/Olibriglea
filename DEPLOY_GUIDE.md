# 🚀 Guia de Deploy - Site Café de Rua

## Passo 1: Preparar o Repositório GitHub

### 1.1 Criar Repositório no GitHub
1. Aceder a [github.com](https://github.com)
2. Clicar em "New Repository"
3. Nome: `cafe-site` (ou outro nome)
4. Deixar público ou privado (ambos funcionam)
5. **NÃO** inicializar com README, .gitignore ou license
6. Clicar em "Create Repository"

### 1.2 Fazer Upload do Código
No terminal, na pasta do projeto:

```bash
# Inicializar Git
git init

# Adicionar todos os ficheiros
git add .

# Fazer commit inicial
git commit -m "Setup inicial do site"

# Adicionar remote (substituir com o teu URL)
git remote add origin https://github.com/SEU-USERNAME/cafe-site.git

# Fazer push
git branch -M main
git push -u origin main
```

---

## Passo 2: Deploy no Netlify

### 2.1 Criar Conta Netlify
1. Aceder a [netlify.com](https://netlify.com)
2. Clicar em "Sign Up"
3. Escolher "Sign up with GitHub" (mais fácil)
4. Autorizar o Netlify a aceder ao GitHub

### 2.2 Deploy do Site
1. No dashboard do Netlify, clicar em "Add new site"
2. Escolher "Import an existing project"
3. Clicar em "GitHub"
4. Selecionar o repositório `cafe-site`
5. Configurações de build:
   - **Build command**: deixar vazio
   - **Publish directory**: deixar vazio ou colocar `.`
6. Clicar em "Deploy site"

⏳ **Aguardar 1-2 minutos** - O site será publicado automaticamente!

### 2.3 Ver o Site
Após deploy concluído:
- URL temporário: `random-name-123456.netlify.app`
- Clicar no URL para ver o site online!

---

## Passo 3: Configurar Decap CMS (Sistema de Gestão)

### 3.1 Ativar Netlify Identity
No painel do Netlify:
1. Ir para "Site Settings" → "Identity"
2. Clicar em "Enable Identity"
3. Em "Registration preferences" → Escolher "Invite only"
4. Em "External providers" → Ativar "Git Gateway"

### 3.2 Convidar Utilizador (Dono do Café)
1. Na tab "Identity", clicar em "Invite users"
2. Inserir email do dono do café
3. Ele receberá um email para criar password

### 3.3 Testar o CMS
1. Aceder a: `SEU-SITE.netlify.app/admin`
2. Login com o email convidado
3. Editar conteúdos (menu, horários, etc.)
4. Clicar em "Publish" - site atualiza automaticamente!

---

## Passo 4: Configurar Domínio Personalizado (Opcional)

### 4.1 Comprar Domínio
Sugestões de sites:
- [Namecheap](https://namecheap.com) - ~€10/ano
- [GoDaddy](https://godaddy.com)
- [Google Domains](https://domains.google)

### 4.2 Configurar no Netlify
No painel do Netlify:
1. "Domain Settings" → "Add custom domain"
2. Inserir domínio comprado (ex: `cafederua.pt`)
3. Seguir instruções para configurar DNS
4. Netlify ativa SSL automaticamente (HTTPS grátis!)

---

## Passo 5: Personalizações Finais

### 5.1 Adicionar Logo/Imagens
1. Aceder ao CMS: `SEU-SITE.netlify.app/admin`
2. Fazer upload das imagens na secção "Galeria"
3. Usar nas páginas conforme necessário

### 5.2 Atualizar Informações
No CMS, editar:
- ✅ Menu com produtos reais
- ✅ Horários corretos
- ✅ Contactos (telefone, email, morada)
- ✅ Links das redes sociais
- ✅ Texto "Sobre"

### 5.3 Configurar Google Maps
1. Obter coordenadas do café no Google Maps
2. Criar embed link
3. Editar `contactos.html` e substituir iframe
4. Fazer commit e push para GitHub

---

## 📋 Checklist de Lançamento

Antes de apresentar ao cliente:

- [ ] Site online e acessível
- [ ] CMS configurado e testado
- [ ] Menu completo e atualizado
- [ ] Horários corretos
- [ ] Contactos verificados
- [ ] Google Maps com localização correta
- [ ] Redes sociais linkadas
- [ ] Logo e imagens do café
- [ ] Testado em mobile
- [ ] Domínio personalizado (se aplicável)
- [ ] Cliente consegue fazer login no CMS

---

## 🎓 Como Ensinar o Cliente a Usar o CMS

### Para o Dono do Café:
1. Aceder a `SEU-SITE.netlify.app/admin`
2. Login com email e password
3. Editar secções:
   - **Menu**: Adicionar/remover/editar produtos
   - **Horários**: Atualizar dias e horas
   - **Informações**: Contactos e redes sociais
4. Clicar em "Save" depois "Publish"
5. Site atualiza em 1-2 minutos!

---

## 🔧 Manutenção Mensal (Teu Trabalho)

### O que podes cobrar mensalmente (€40-60):
- ✅ Verificar site está online
- ✅ Backups automáticos (GitHub)
- ✅ Updates de segurança
- ✅ Suporte via email/WhatsApp
- ✅ Pequenas alterações (1-2 por mês)
- ✅ Relatórios de visitas (Google Analytics)

---

## 📞 Contactos de Suporte

**Para o Cliente:**
- Email: [teu-email]
- WhatsApp: [teu-numero]
- Disponibilidade: [definir horário]

**Recursos Úteis:**
- [Documentação Netlify](https://docs.netlify.com)
- [Documentação Decap CMS](https://decapcms.org/docs)

---

## 🚨 Resolução de Problemas

### Site não atualiza após editar no CMS
- Aguardar 2-3 minutos
- Limpar cache do browser (Ctrl+F5)
- Verificar se clicou em "Publish"

### Não consegue fazer login no CMS
- Verificar se Identity está ativo no Netlify
- Verificar se recebeu email de convite
- Tentar reset de password

### Imagens não aparecem
- Verificar tamanho (máx 5MB)
- Usar formatos: JPG, PNG, WebP
- Re-fazer upload no CMS

---

**✅ Pronto! O site está online e funcional!**
