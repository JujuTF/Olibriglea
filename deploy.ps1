# ============================================
# Deploy Olibriglea - PowerShell Script
# ============================================

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "       DEPLOY OLIBRIGLEA - Automatico" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script vai ajudar a fazer deploy do site." -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para comecar"

# ============================================
# PASSO 1: Verificar Git
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 1: Verificar Git" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Git encontrado!" -ForegroundColor Green
        Write-Host $gitVersion
    } else {
        throw "Git nao instalado"
    }
} catch {
    Write-Host "[ERRO] Git nao esta instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale Git primeiro:" -ForegroundColor Yellow
    Write-Host "https://git-scm.com/downloads"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 2: Verificar Ficheiros
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 2: Verificar Ficheiros" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$missing = 0
$files = @("index.html", "login.html", "registo.html", "netlify.toml", "css/style.css", "js/config.js")

Write-Host "Verificando ficheiros essenciais..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[X] Ficheiro em falta: $file" -ForegroundColor Red
        $missing++
    }
}

Write-Host ""

if ($missing -gt 0) {
    Write-Host "[ERRO] $missing ficheiro(s) em falta!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Certifique-se que este script esta na pasta raiz do projeto." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[OK] Todos os ficheiros presentes!" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 3: Inicializar Git
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 3: Inicializar Git" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Repositorio inicializado!" -ForegroundColor Green
    } else {
        Write-Host "[ERRO] Erro ao inicializar Git!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "[OK] Ja e um repositorio Git!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 4: Criar .gitignore
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 4: Criar .gitignore" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".gitignore")) {
    Write-Host "Criando .gitignore..." -ForegroundColor Cyan
    
    $gitignoreContent = @"
# System files
.DS_Store
Thumbs.db

# Editors
.vscode/
.idea/
*.swp

# Node modules
node_modules/

# Environment
.env
.env.local

# Logs
*.log
"@
    
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host "[OK] .gitignore criado!" -ForegroundColor Green
} else {
    Write-Host "[OK] .gitignore ja existe!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 5: Configurar GitHub
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 5: Configurar GitHub" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Precisa de criar um repositorio no GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "Como fazer:"
Write-Host "  1. Abra: https://github.com/new"
Write-Host "  2. Nome: olibriglea-site"
Write-Host "  3. Visibilidade: Public"
Write-Host "  4. NAO marque nenhuma opcao"
Write-Host "  5. Clique em 'Create repository'"
Write-Host "  6. Copie o URL que aparece"
Write-Host ""
Write-Host "Exemplo:"
Write-Host "  https://github.com/seu-username/olibriglea-site.git" -ForegroundColor Gray
Write-Host ""

$openGit = Read-Host "Quer abrir GitHub agora no browser? (s/n)"
if ($openGit -eq "s") {
    Start-Process "https://github.com/new"
    Write-Host ""
    Write-Host "Aguarde criar o repositorio..." -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Pressione Enter quando tiver o URL pronto"
}

Write-Host ""
$repoUrl = Read-Host "Cole aqui o URL do repositorio GitHub"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "[ERRO] URL nao fornecido!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "[OK] URL configurado: $repoUrl" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 6: Configurar Remote
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 6: Configurar Remote" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$remoteExists = git remote 2>&1 | Select-String "origin"
if ($remoteExists) {
    Write-Host "Remote 'origin' ja existe. Removendo..." -ForegroundColor Cyan
    git remote remove origin
}

Write-Host "Adicionando remote..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Remote configurado!" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Erro ao adicionar remote!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se o URL esta correto." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 7: Adicionar Ficheiros
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 7: Adicionar Ficheiros" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Adicionando todos os ficheiros..." -ForegroundColor Cyan
git add .

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Ficheiros adicionados!" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Erro ao adicionar ficheiros!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 8: Fazer Commit
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 8: Fazer Commit" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$commitMsg = Read-Host "Mensagem do commit (ou Enter para usar padrao)"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Deploy inicial - Olibriglea site"
}

Write-Host ""
Write-Host "Fazendo commit..." -ForegroundColor Cyan
git commit -m $commitMsg

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[AVISO] Pode ser que nao haja alteracoes para commitar." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continuar mesmo assim? (s/n)"
    if ($continue -ne "s") {
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "[OK] Commit realizado!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 9: Fazer Push
# ============================================
Clear-Host
Write-Host ""
Write-Host "PASSO 9: Enviar para GitHub" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Configurando branch main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "Enviando codigo para GitHub..." -ForegroundColor Cyan
Write-Host "Isto pode demorar alguns segundos..." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERRO] Erro ao fazer push!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possiveis causas:" -ForegroundColor Yellow
    Write-Host "  1. Credenciais incorretas"
    Write-Host "  2. URL do repositorio errado"
    Write-Host "  3. Sem permissoes"
    Write-Host "  4. Repositorio ja tem conteudo"
    Write-Host ""
    Write-Host "Tente fazer push manualmente:"
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  CODIGO ENVIADO PARA GITHUB COM SUCESSO!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para continuar"

# ============================================
# PASSO 10: Instruções Netlify
# ============================================
Clear-Host
Write-Host ""
Write-Host "PROXIMOS PASSOS: Deploy no Netlify" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "O codigo ja esta no GitHub!" -ForegroundColor Green
Write-Host "Agora vamos fazer deploy no Netlify para o site ficar online." -ForegroundColor Green
Write-Host ""
Write-Host "PASSO A PASSO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Abra: https://app.netlify.com"
Write-Host "  2. Faca login com GitHub"
Write-Host "  3. Clique em: 'Add new site'"
Write-Host "  4. Escolha: 'Import an existing project'"
Write-Host "  5. Selecione: GitHub"
Write-Host "  6. Procure e selecione: olibriglea-site"
Write-Host "  7. Configuracoes de build:"
Write-Host "     - Build command: (deixar vazio)"
Write-Host "     - Publish directory: ."
Write-Host "  8. Clique em: 'Deploy site'"
Write-Host "  9. Aguarde 2-3 minutos..."
Write-Host " 10. Site estara online!"
Write-Host ""

$openNetlify = Read-Host "Quer abrir Netlify agora no browser? (s/n)"
if ($openNetlify -eq "s") {
    Start-Process "https://app.netlify.com"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "INFORMACOES DO REPOSITORIO" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GitHub: $repoUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quando o deploy no Netlify terminar, o site estara disponivel"
Write-Host "em algo como: https://seu-site-aleatorio.netlify.app" -ForegroundColor Gray
Write-Host ""
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "         SCRIPT CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host ""
Read-Host "Pressione Enter para sair"