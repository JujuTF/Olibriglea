// ============================================
// 📁 ESTRUTURA DE PASTAS RECOMENDADA
// ============================================

/*
olibriglea/
│
├── index.html                  (Homepage)
├── login.html
├── registo.html
├── area-cliente.html
├── backoffice-pontos.html
│
├── css/
│   └── styles.css              (se quiseres separar CSS)
│
├── js/
│   ├── config.js               ← Configuração Supabase
│   ├── auth.js                 ← Login, registo, logout
│   ├── clientes.js             ← Funções de clientes
│   ├── pontos.js               ← Adicionar/resgatar pontos
│   └── backoffice.js           ← Funções do backoffice
│
└── package.json                (se usares npm)
*/

// ============================================
// 📄 config.js - Configuração do Supabase
// ============================================

// IMPORTANTE: Nunca committes as tuas chaves reais no GitHub!
// Usa variáveis de ambiente em produção

const SUPABASE_URL = 'https://ugrigjbdtbrhyytsgbzb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-deEmuYKcp5hAgZ-cEYscg_PpoSM_o-';

// Criar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para usar noutros ficheiros
window.supabase = supabase;
