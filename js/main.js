// ==========================================
// CAFÉ DE RUA - JavaScript Principal
// ==========================================

// Dados temporários (serão substituídos pelo CMS)
const siteData = {
    horarios: [
        { dia: 'Segunda a Sexta', horas: '07:00 - 20:00' },
        { dia: 'Sábado', horas: '08:00 - 22:00' },
        { dia: 'Domingo', horas: '09:00 - 18:00' }
    ],
    menu: {
        cafes: [
            { nome: 'Expresso', descricao: 'Café curto e intenso', preco: '0.80€' },
            { nome: 'Café Duplo', descricao: 'Expresso duplo para mais energia', preco: '1.20€' },
            { nome: 'Galão', descricao: 'Café com leite cremoso', preco: '1.50€' },
            { nome: 'Cappuccino', descricao: 'Café com espuma de leite', preco: '2.00€' },
            { nome: 'Café Gelado', descricao: 'Perfeito para dias quentes', preco: '2.50€' }
        ],
        bebidas: [
            { nome: 'Sumo Natural', descricao: 'Laranja ou limão', preco: '2.50€' },
            { nome: 'Chá', descricao: 'Várias variedades', preco: '1.50€' },
            { nome: 'Chocolate Quente', descricao: 'Cremoso e reconfortante', preco: '2.00€' },
            { nome: 'Batido', descricao: 'Morango, banana ou chocolate', preco: '3.00€' }
        ],
        pastelaria: [
            { nome: 'Croissant', descricao: 'Amanteigado e crocante', preco: '1.20€' },
            { nome: 'Pastel de Nata', descricao: 'O clássico português', preco: '1.10€' },
            { nome: 'Bolo do Dia', descricao: 'Fatia generosa', preco: '2.50€' },
            { nome: 'Tosta Mista', descricao: 'Fiambre e queijo', preco: '2.00€' },
            { nome: 'Croissant Misto', descricao: 'Recheado com fiambre e queijo', preco: '2.50€' }
        ],
        sanduiches: [
            { nome: 'Sanduíche de Atum', descricao: 'Com alface e tomate', preco: '3.50€' },
            { nome: 'Sanduíche de Frango', descricao: 'Grelhado com molho', preco: '4.00€' },
            { nome: 'Sanduíche Vegetariana', descricao: 'Queijo, tomate e cogumelos', preco: '3.50€' }
        ]
    }
};

// ==========================================
// NAVEGAÇÃO MOBILE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Carregar conteúdos dinâmicos
    loadSchedule();
    loadMenu();
});

// ==========================================
// CARREGAR HORÁRIOS
// ==========================================

function loadSchedule() {
    // Na página inicial
    const scheduleContent = document.getElementById('schedule-content');
    if (scheduleContent) {
        scheduleContent.innerHTML = renderSchedule(siteData.horarios);
    }

    // Na página de contactos
    const contactSchedule = document.getElementById('contact-schedule');
    if (contactSchedule) {
        contactSchedule.innerHTML = renderSchedule(siteData.horarios);
    }
}

function renderSchedule(horarios) {
    return horarios.map(item => `
        <div class="schedule-item">
            <span class="schedule-day">${item.dia}</span>
            <span class="schedule-hours">${item.horas}</span>
        </div>
    `).join('');
}

// ==========================================
// CARREGAR MENU
// ==========================================

function loadMenu() {
    const menuContent = document.getElementById('menu-content');
    if (!menuContent) return;

    const menuHTML = `
        ${renderMenuCategory('Cafés', siteData.menu.cafes)}
        ${renderMenuCategory('Bebidas', siteData.menu.bebidas)}
        ${renderMenuCategory('Pastelaria', siteData.menu.pastelaria)}
        ${renderMenuCategory('Sanduíches', siteData.menu.sanduiches)}
    `;

    menuContent.innerHTML = menuHTML;
}

function renderMenuCategory(titulo, items) {
    return `
        <div class="menu-category fade-in">
            <h2>${titulo}</h2>
            <div class="menu-items">
                ${items.map(item => `
                    <div class="menu-item">
                        <div class="menu-item-info">
                            <h3>${item.nome}</h3>
                            <p>${item.descricao}</p>
                        </div>
                        <div class="menu-item-price">${item.preco}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// ANIMAÇÕES AO SCROLL
// ==========================================

// Intersection Observer para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.highlight-card, .menu-category, .info-item');
    fadeElements.forEach(el => observer.observe(el));
});

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Fetch de dados JSON (para integração com CMS)
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Atualizar dados do site via CMS
async function loadSiteData() {
    // Esta função será usada quando o CMS estiver configurado
    const horariosData = await fetchData('/content/horarios.json');
    const menuData = await fetchData('/content/menu.json');
    
    if (horariosData) {
        siteData.horarios = horariosData;
        loadSchedule();
    }
    
    if (menuData) {
        siteData.menu = menuData;
        loadMenu();
    }
}

// ==========================================
// PERFORMANCE
// ==========================================

// Lazy loading de imagens
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para browsers antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==========================================
// ACESSIBILIDADE
// ==========================================

// Detectar navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// ==========================================
// LOG DE DESENVOLVIMENTO
// ==========================================

console.log('🎉 Site do Café de Rua carregado com sucesso!');
console.log('📱 Navegação mobile:', document.querySelector('.nav-toggle') ? 'Ativa' : 'Desktop');
