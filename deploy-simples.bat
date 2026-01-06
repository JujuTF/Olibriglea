@echo off
chcp 65001 >nul 2>&1
color 0A
title Deploy Olibriglea - Assistente Automatico

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║      🚀 DEPLOY OLIBRIGLEA 🚀               ║
echo ║         Assistente Automatico              ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.
echo.
echo Este script vai ajudar a fazer deploy do site.
echo.
echo Pressione qualquer tecla para comecar...
pause >nul

:CHECK_GIT
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 1: Verificar Git
echo ════════════════════════════════════════════
echo.

git --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [X] ERRO: Git nao esta instalado!
    echo.
    echo Por favor, instale Git primeiro:
    echo https://git-scm.com/downloads
    echo.
    echo Depois de instalar, execute este script novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Git encontrado!
git --version
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:CHECK_FILES
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 2: Verificar Ficheiros
echo ════════════════════════════════════════════
echo.

set MISSING=0

echo Verificando ficheiros essenciais...
echo.

if not exist index.html (
    echo [X] Ficheiro em falta: index.html
    set /a MISSING+=1
) else (
    echo [OK] index.html
)

if not exist login.html (
    echo [X] Ficheiro em falta: login.html
    set /a MISSING+=1
) else (
    echo [OK] login.html
)

if not exist registo.html (
    echo [X] Ficheiro em falta: registo.html
    set /a MISSING+=1
) else (
    echo [OK] registo.html
)

if not exist netlify.toml (
    echo [X] Ficheiro em falta: netlify.toml
    set /a MISSING+=1
) else (
    echo [OK] netlify.toml
)

if not exist css\style.css (
    echo [X] Ficheiro em falta: css\style.css
    set /a MISSING+=1
) else (
    echo [OK] css\style.css
)

if not exist js\config.js (
    echo [X] Ficheiro em falta: js\config.js
    set /a MISSING+=1
) else (
    echo [OK] js\config.js
)

echo.

if %MISSING% gtr 0 (
    color 0C
    echo [X] ERRO: %MISSING% ficheiro(s) em falta!
    echo.
    echo Certifique-se que este script esta na pasta raiz do projeto.
    echo A pasta deve conter: index.html, css/, js/, etc.
    echo.
    pause
    exit /b 1
)

echo [OK] Todos os ficheiros essenciais presentes!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:INIT_GIT
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 3: Inicializar Git
echo ════════════════════════════════════════════
echo.

if not exist .git (
    echo Este diretorio ainda nao e um repositorio Git.
    echo A inicializar...
    echo.
    git init
    if errorlevel 1 (
        color 0C
        echo [X] Erro ao inicializar Git!
        pause
        exit /b 1
    )
    echo [OK] Repositorio Git inicializado!
) else (
    echo [OK] Ja e um repositorio Git!
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:CREATE_GITIGNORE
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 4: Criar .gitignore
echo ════════════════════════════════════════════
echo.

if not exist .gitignore (
    echo Criando .gitignore...
    (
        echo # System files
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Editors
        echo .vscode/
        echo .idea/
        echo *.swp
        echo.
        echo # Node modules
        echo node_modules/
        echo.
        echo # Environment
        echo .env
        echo .env.local
        echo.
        echo # Logs
        echo *.log
    ) > .gitignore
    echo [OK] .gitignore criado!
) else (
    echo [OK] .gitignore ja existe!
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:GITHUB_SETUP
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 5: Configurar GitHub
echo ════════════════════════════════════════════
echo.
echo IMPORTANTE: Antes de continuar, precisa de criar
echo um repositorio no GitHub.
echo.
echo Como fazer:
echo 1. Abra: https://github.com/new
echo 2. Nome: olibriglea-site
echo 3. Visibilidade: Public
echo 4. NAO marque nenhuma opcao
echo 5. Clique em "Create repository"
echo 6. Copie o URL que aparece
echo.
echo Exemplo de URL:
echo https://github.com/seu-username/olibriglea-site.git
echo.
echo.

set /p OPEN_GITHUB="Quer abrir GitHub agora no browser? (s/n): "
if /i "%OPEN_GITHUB%"=="s" (
    start https://github.com/new
    echo.
    echo Aguarde criar o repositorio...
    echo.
    pause
)

echo.
set /p REPO_URL="Cole aqui o URL do repositorio GitHub: "

if "%REPO_URL%"=="" (
    color 0C
    echo [X] URL nao fornecido!
    echo.
    pause
    goto GITHUB_SETUP
)

echo.
echo URL configurado: %REPO_URL%
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:CONFIGURE_REMOTE
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 6: Configurar Remote
echo ════════════════════════════════════════════
echo.

git remote | findstr "origin" >nul 2>&1
if not errorlevel 1 (
    echo Remote 'origin' ja existe.
    echo A remover...
    git remote remove origin
)

echo Adicionando remote...
git remote add origin %REPO_URL%

if errorlevel 1 (
    color 0C
    echo [X] Erro ao adicionar remote!
    echo.
    echo Verifique se o URL esta correto.
    echo.
    pause
    goto GITHUB_SETUP
)

echo [OK] Remote configurado!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:ADD_FILES
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 7: Adicionar Ficheiros ao Git
echo ════════════════════════════════════════════
echo.

echo Adicionando todos os ficheiros...
echo.
git add .

if errorlevel 1 (
    color 0C
    echo [X] Erro ao adicionar ficheiros!
    pause
    exit /b 1
)

echo [OK] Ficheiros adicionados!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:COMMIT
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 8: Fazer Commit
echo ════════════════════════════════════════════
echo.

set /p COMMIT_MSG="Mensagem do commit (ou Enter para usar padrao): "

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Deploy inicial - Olibriglea site
)

echo.
echo Fazendo commit...
git commit -m "%COMMIT_MSG%"

if errorlevel 1 (
    color 0C
    echo [X] Erro ao fazer commit!
    echo.
    echo Pode ser que nao haja alteracoes para commitar.
    echo.
    set /p CONTINUE="Continuar mesmo assim? (s/n): "
    if /i not "%CONTINUE%"=="s" (
        pause
        exit /b 1
    )
)

echo [OK] Commit realizado!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:PUSH
cls
echo.
echo ════════════════════════════════════════════
echo  PASSO 9: Enviar para GitHub
echo ════════════════════════════════════════════
echo.

echo Configurando branch main...
git branch -M main

echo.
echo Enviando codigo para GitHub...
echo Isto pode demorar alguns segundos...
echo.

git push -u origin main

if errorlevel 1 (
    color 0C
    echo.
    echo [X] Erro ao fazer push!
    echo.
    echo Possiveis causas:
    echo 1. Credenciais incorretas
    echo 2. URL do repositorio errado
    echo 3. Sem permissoes
    echo 4. Repositorio ja tem conteudo
    echo.
    echo Tente fazer push manualmente:
    echo git push -u origin main
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║  ✓ CODIGO ENVIADO PARA GITHUB COM SUCESSO!║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

:NETLIFY_INSTRUCTIONS
cls
color 0B
echo.
echo ════════════════════════════════════════════
echo  PROXIMOS PASSOS: Deploy no Netlify
echo ════════════════════════════════════════════
echo.
echo O codigo ja esta no GitHub! Agora vamos fazer
echo deploy no Netlify para o site ficar online.
echo.
echo ─────────────────────────────────────────────
echo  PASSO A PASSO:
echo ─────────────────────────────────────────────
echo.
echo 1. Abra: https://app.netlify.com
echo.
echo 2. Faca login com GitHub
echo.
echo 3. Clique em: "Add new site"
echo.
echo 4. Escolha: "Import an existing project"
echo.
echo 5. Selecione: GitHub
echo.
echo 6. Procure e selecione: olibriglea-site
echo.
echo 7. Configuracoes de build:
echo    - Build command: (deixar vazio)
echo    - Publish directory: .
echo.
echo 8. Clique em: "Deploy site"
echo.
echo 9. Aguarde 2-3 minutos...
echo.
echo 10. Site estara online!
echo.
echo ─────────────────────────────────────────────
echo.
set /p OPEN_NETLIFY="Quer abrir Netlify agora no browser? (s/n): "

if /i "%OPEN_NETLIFY%"=="s" (
    start https://app.netlify.com
)

echo.
echo ════════════════════════════════════════════
echo  INFORMACOES DO REPOSITORIO
echo ════════════════════════════════════════════
echo.
echo GitHub: %REPO_URL%
echo.
echo ════════════════════════════════════════════
echo.
echo.
echo Quando o deploy no Netlify terminar, o site
echo estara disponivel em algo como:
echo https://seu-site-aleatorio.netlify.app
echo.
echo.
color 0A
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║         ✓ SCRIPT CONCLUIDO!                ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.
echo.
pause
