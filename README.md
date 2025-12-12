# Site Café de Rua

Site institucional para café com CMS integrado para gestão de conteúdos.

## 🛠️ Stack Técnica

- **Frontend**: HTML5, CSS3, JavaScript puro
- **CMS**: Decap CMS (Git-based)
- **Hosting**: Netlify (grátis)
- **Controlo de Versão**: GitHub

## 📁 Estrutura do Projeto

```
cafe-site/
├── index.html              # Página principal
├── menu.html              # Página do menu
├── sobre.html             # Sobre nós
├── contactos.html         # Contactos e localização
├── css/
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Media queries
├── js/
│   └── main.js            # Scripts principais
├── admin/
│   └── config.yml         # Configuração Decap CMS
├── images/                # Imagens do site
├── content/               # Conteúdo editável (JSON)
│   ├── menu.json
│   ├── horarios.json
│   └── info.json
└── _redirects             # Configuração Netlify
```

## 🚀 Como Usar

### Setup Inicial

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [URL_DO_SEU_REPO]
   git push -u origin main
   ```

2. **Deploy no Netlify**
   - Aceder a [netlify.com](https://netlify.com)
   - Conectar repositório GitHub
   - Deploy automático configurado!

3. **Configurar Domínio**
   - Netlify → Domain Settings
   - Adicionar domínio personalizado

### Editar Conteúdos (para o dono do café)

1. Aceder a: `seu-site.netlify.app/admin`
2. Login com GitHub
3. Editar menu, horários, fotos
4. Publicar → Site atualiza automaticamente!

## 📝 Customização

### Cores
Editar variáveis CSS em `css/style.css`:
```css
:root {
  --primary-color: #6B4423;
  --secondary-color: #D4A574;
  --text-color: #333;
}
```

### Conteúdo
Ficheiros JSON em `/content/` são editáveis via CMS ou manualmente.

## 🔧 Manutenção

- **Custos**: Grátis (Netlify) + ~15€/ano (domínio)
- **Backups**: Automático via GitHub
- **Updates**: Via CMS ou Git

## 📞 Suporte

[Adicionar contacto para suporte técnico]
