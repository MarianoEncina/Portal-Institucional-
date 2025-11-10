// Gestión del widget de clima
class ClimaManager {
    constructor() {
        this.ciudadActual = 'Buenos Aires';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.cargarClima(this.ciudadActual);
    }

    setupEventListeners() {
        const buscarBtn = document.getElementById('buscar-clima');
        const ciudadInput = document.getElementById('ciudad-buscar');

        if (buscarBtn && ciudadInput) {
            buscarBtn.addEventListener('click', () => {
                const ciudad = ciudadInput.value.trim();
                if (ciudad) {
                    this.cargarClima(ciudad);
                }
            });

            ciudadInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const ciudad = ciudadInput.value.trim();
                    if (ciudad) {
                        this.cargarClima(ciudad);
                    }
                }
            });
        }
    }

    async cargarClima(ciudad) {
        try {
            this.mostrarLoading(true);
            
            // Simulación de datos - En un caso real aquí harías una llamada a una API
            const datosClima = await this.simularAPIClima(ciudad);
            this.mostrarClima(datosClima);
            this.ciudadActual = ciudad;
            
        } catch (error) {
            this.mostrarError('Error al cargar los datos del clima');
            console.error('Error:', error);
        } finally {
            this.mostrarLoading(false);
        }
    }

    simularAPIClima(ciudad) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Datos simulados para diferentes ciudades
                const datosPorCiudad = {
                    'buenos aires': { temperatura: 22, descripcion: 'Soleado', icono: 'sun' },
                    'córdoba': { temperatura: 18, descripcion: 'Parcialmente nublado', icono: 'cloud-sun' },
                    'mendoza': { temperatura: 25, descripcion: 'Despejado', icono: 'sun' },
                    'rosario': { temperatura: 20, descripcion: 'Lluvioso', icono: 'cloud-rain' },
                    'la plata': { temperatura: 21, descripcion: 'Nublado', icono: 'cloud' },
                    'mar del plata': { temperatura: 16, descripcion: 'Ventoso', icono: 'wind' }
                };

                const ciudadLower = ciudad.toLowerCase();
                const datos = datosPorCiudad[ciudadLower] || 
                            { temperatura: 21, descripcion: 'Despejado', icono: 'sun' };
                
                resolve({
                    ciudad: ciudad,
                    ...datos
                });
            }, 1000);
        });
    }

    mostrarClima(datos) {
        const ciudadElement = document.getElementById('ciudad');
        const temperaturaElement = document.getElementById('temperatura');
        const descripcionElement = document.getElementById('descripcion');
        const climaIcon = document.getElementById('clima-icon');

        if (ciudadElement) ciudadElement.textContent = datos.ciudad;
        if (temperaturaElement) temperaturaElement.textContent = `${datos.temperatura}°C`;
        if (descripcionElement) descripcionElement.textContent = datos.descripcion;
        
        if (climaIcon) {
            const iconClass = this.obtenerClaseIcono(datos.icono);
            climaIcon.innerHTML = `<i class="fas ${iconClass} text-[#f59e0b]"></i>`;
        }

        // Actualizar input de búsqueda
        const ciudadInput = document.getElementById('ciudad-buscar');
        if (ciudadInput) {
            ciudadInput.value = '';
        }
    }

    obtenerClaseIcono(icono) {
        const iconos = {
            'sun': 'fa-sun',
            'cloud-sun': 'fa-cloud-sun',
            'cloud-rain': 'fa-cloud-rain',
            'cloud': 'fa-cloud',
            'wind': 'fa-wind'
        };
        return iconos[icono] || 'fa-sun';
    }

    mostrarLoading(mostrar) {
        const buscarBtn = document.getElementById('buscar-clima');
        if (buscarBtn) {
            if (mostrar) {
                buscarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                buscarBtn.disabled = true;
            } else {
                buscarBtn.innerHTML = '<i class="fas fa-search"></i>';
                buscarBtn.disabled = false;
            }
        }
    }

    mostrarError(mensaje) {
        // Podrías implementar un sistema de notificaciones más elaborado
        console.error(mensaje);
        alert(mensaje);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.climaManager = new ClimaManager();
});