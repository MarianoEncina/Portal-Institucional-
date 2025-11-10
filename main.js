// Navegación entre secciones
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.showSection('home');
    }

    setupEventListeners() {
        // Navegación desktop y mobile
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.updateActiveNav(link);
                
                // Cerrar menú móvil si está abierto
                this.closeMobileMenu();
            });
        });

        // Botones de acción rápida
        document.querySelectorAll('.nav-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.showSection(section);
                this.updateActiveNavBySection(section);
            });
        });

        // Navegación del footer
        document.querySelectorAll('footer .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
                this.updateActiveNavBySection(section);
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    setTimeout(() => mobileMenu.classList.add('open'), 10);
                } else {
                    this.closeMobileMenu();
                }
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
        }
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;

            // Scroll suave al inicio de la sección
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav(activeLink) {
        // Remover active de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Agregar active al link clickeado
        activeLink.classList.add('active');
    }

    updateActiveNavBySection(section) {
        // Encontrar y activar el link correspondiente a la sección
        const correspondingLink = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (correspondingLink) {
            this.updateActiveNav(correspondingLink);
        }
    }
}
// main.js - Solo la funcionalidad del botón
document.addEventListener('DOMContentLoaded', function() {
    // Buscar el botón por su atributo data-section
    const botonHistoria = document.querySelector('button[data-section="historia"]');
    
    if (botonHistoria) {
        botonHistoria.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ocultar todas las secciones
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar solo la sección historia
            const seccionHistoria = document.getElementById('historia');
            if (seccionHistoria) {
                seccionHistoria.classList.add('active');
            }
            
            // Scroll al inicio de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        console.log('✅ Botón de historia configurado correctamente');
    }
});



// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

