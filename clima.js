// Gestión del widget de clima con WeatherAPI
class ClimaManager {
    constructor() {
        this.apiKey = 'a3d15e8d1b0a4c718f4192905251011'; // Reemplaza con tu API Key de WeatherAPI
        this.ciudadActual = 'Posadas, Misiones';
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
            
            const datosClima = await this.obtenerClimaReal(ciudad);
            this.mostrarClima(datosClima);
            this.ciudadActual = ciudad;
            
        } catch (error) {
            console.error('Error al cargar el clima:', error);
            this.mostrarError('No se pudo obtener la información del clima');
        } finally {
            this.mostrarLoading(false);
        }
    }

    async obtenerClimaReal(ciudad) {
        // Endpoint de WeatherAPI para clima actual
        const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${encodeURIComponent(ciudad)}&aqi=no&lang=es`;
        
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error('Ciudad no encontrada o error en la API');
        }

        const datos = await respuesta.json();
        
        return {
            ciudad: datos.location.name,
            region: datos.location.region,
            pais: datos.location.country,
            temperatura: Math.round(datos.current.temp_c),
            descripcion: datos.current.condition.text,
            icono: this.obtenerIconoClima(datos.current.condition.icon),
            humedad: datos.current.humidity,
            viento: datos.current.wind_kph,
            sensacionTermica: Math.round(datos.current.feelslike_c)
        };
    }

    obtenerIconoClima(iconUrl) {
        // WeatherAPI devuelve URLs de iconos, los mapeamos a clases FontAwesome
        const iconMap = {
            'sunny': 'sun',
            'clear': 'sun',
            'partly-cloudy': 'cloud-sun',
            'cloudy': 'cloud',
            'overcast': 'cloud',
            'mist': 'cloud',
            'fog': 'smog',
            'light-rain': 'cloud-rain',
            'moderate-rain': 'cloud-rain',
            'heavy-rain': 'cloud-showers-heavy',
            'light-snow': 'snowflake',
            'moderate-snow': 'snowflake',
            'heavy-snow': 'snowflake',
            'thunder': 'bolt',
            'thunder-rain': 'bolt'
        };

        // Extraer el nombre del icono de la URL
        const iconName = iconUrl.split('/').pop().split('.')[0];
        return iconMap[iconName] || 'sun';
    }

    mostrarClima(datos) {
        const ciudadElement = document.getElementById('ciudad');
        const temperaturaElement = document.getElementById('temperatura');
        const descripcionElement = document.getElementById('descripcion');
        const climaIcon = document.getElementById('clima-icon');

        if (ciudadElement) {
            ciudadElement.textContent = `${datos.ciudad}, ${datos.region}`;
        }
        
        if (temperaturaElement) {
            temperaturaElement.textContent = `${datos.temperatura}°C`;
        }
        
        if (descripcionElement) {
            descripcionElement.textContent = datos.descripcion;
        }
        
        if (climaIcon) {
            const iconClass = this.obtenerClaseIcono(datos.icono);
            climaIcon.innerHTML = `<i class="fas ${iconClass} text-[#f59e0b]"></i>`;
        }

        // Mostrar información adicional en consola (opcional)
        console.log('Datos del clima:', {
            ciudad: datos.ciudad,
            temperatura: datos.temperatura,
            descripcion: datos.descripcion,
            humedad: `${datos.humedad}%`,
            viento: `${datos.viento} km/h`,
            sensacion: `${datos.sensacionTermica}°C`
        });

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
            'wind': 'fa-wind',
            'smog': 'fa-smog',
            'snowflake': 'fa-snowflake',
            'bolt': 'fa-bolt',
            'cloud-showers-heavy': 'fa-cloud-showers-heavy'
        };
        return iconos[icono] || 'fa-sun';
    }

    mostrarLoading(mostrar) {
        const buscarBtn = document.getElementById('buscar-clima');
        const climaIcon = document.getElementById('clima-icon');
        
        if (buscarBtn) {
            if (mostrar) {
                buscarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                buscarBtn.disabled = true;
            } else {
                buscarBtn.innerHTML = '<i class="fas fa-search"></i>';
                buscarBtn.disabled = false;
            }
        }

        if (climaIcon && mostrar) {
            climaIcon.innerHTML = '<i class="fas fa-spinner fa-spin text-[#f59e0b]"></i>';
        }
    }

    mostrarError(mensaje) {
        const temperaturaElement = document.getElementById('temperatura');
        const descripcionElement = document.getElementById('descripcion');
        const climaIcon = document.getElementById('clima-icon');

        if (temperaturaElement) temperaturaElement.textContent = '--';
        if (descripcionElement) descripcionElement.textContent = mensaje;
        if (climaIcon) climaIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500"></i>';

        console.error('Error del clima:', mensaje);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.climaManager = new ClimaManager();
});