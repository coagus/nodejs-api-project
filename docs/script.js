// Sistema de temas
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'system';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.updateActiveThemeButton();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Aplicar tema del sistema si es necesario
        if (theme === 'system') {
            this.applySystemTheme();
        }
    }

    applySystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = mediaQuery.matches;
        
        // Los estilos CSS ya manejan esto, pero podemos agregar lógica adicional si es necesario
        console.log('System theme detected:', isDark ? 'dark' : 'light');
    }

    setupEventListeners() {
        // Event listeners para los botones de tema
        document.querySelectorAll('.theme-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
                this.updateActiveThemeButton();
            });
        });

        // Escuchar cambios en el tema del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.applySystemTheme();
            }
        });
    }

    updateActiveThemeButton() {
        document.querySelectorAll('.theme-option').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === this.currentTheme) {
                button.classList.add('active');
            }
        });
    }
}

// Gestor del sidebar
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
    }

    setupEventListeners() {
        // Toggle del sidebar en mobile
        this.toggleBtn?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Cerrar sidebar al hacer clic en el overlay
        this.overlay?.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Cerrar sidebar al hacer clic en enlaces (mobile)
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    this.closeSidebar();
                }
            });
        });

        // Cerrar sidebar al redimensionar la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('show');
        this.overlay.classList.toggle('show');
        document.body.style.overflow = this.sidebar.classList.contains('show') ? 'hidden' : '';
    }

    closeSidebar() {
        this.sidebar.classList.remove('show');
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        
        function updateActiveNav() {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Llamada inicial
    }
}

// Gestor de código
class CodeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCopyButtons();
        this.setupSyntaxHighlighting();
    }

    setupCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const codeBlock = e.target.closest('.code-block').querySelector('code');
                await this.copyToClipboard(codeBlock.textContent, button);
            });
        });
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Feedback visual
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i>';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-secondary');
            }, 2000);
            
        } catch (err) {
            console.error('Error al copiar: ', err);
            // Fallback para navegadores antiguos
            this.fallbackCopyToClipboard(text, button);
        }
    }

    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            button.innerHTML = '<i class="bi bi-check"></i>';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = '<i class="bi bi-clipboard"></i>';
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-secondary');
            }, 2000);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }

    setupSyntaxHighlighting() {
        // Prism.js ya está configurado, pero podemos agregar funcionalidades adicionales
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
}

// Gestor de navegación
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupProgressIndicator();
        this.setupBackToTop();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                const key = e.key;
                const keyMap = {
                    '1': '#inicio',
                    '2': '#health-endpoint',
                    '3': '#configuracion',
                    '4': '#estructura'
                };
                
                if (keyMap[key]) {
                    e.preventDefault();
                    document.querySelector(keyMap[key])?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    setupProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        function updateReadingProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
        
        window.addEventListener('scroll', updateReadingProgress);
    }

    setupBackToTop() {
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTopButton.className = 'btn btn-primary position-fixed';
        backToTopButton.style.cssText = `
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los gestores
    new ThemeManager();
    new SidebarManager();
    new CodeManager();
    new NavigationManager();
    
    // Configurar tooltips de Bootstrap si están disponibles
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    console.log('🚀 API Project Documentation loaded successfully!');
});
