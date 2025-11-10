// Funcionalidades específicas para la sección de IA Generativa
class IAManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInteractiveExamples();
    }

    setupEventListeners() {
        // Aquí puedes agregar interactividad específica para la sección de IA
        // Por ejemplo, ejemplos interactivos de prompts
    }

    setupInteractiveExamples() {
        // Ejemplo interactivo de generación de código
        this.setupCodeGenerationExample();
        
        // Ejemplo interactivo de prompts
        this.setupPromptExamples();
    }

    setupCodeGenerationExample() {
        // Podrías agregar un editor de código simple que muestre
        // cómo la IA puede ayudar a generar código
        console.log('Ejemplos de IA configurados');
    }

    setupPromptExamples() {
        // Ejemplos de prompts que los usuarios pueden probar
        const promptExamples = [
            {
                category: 'Desarrollo Web',
                prompts: [
                    "Crea una función JavaScript para validar un formulario de registro",
                    "Genera un componente React para un carrito de compras",
                    "Diseña una API REST para un sistema de blog"
                ]
            },
            {
                category: 'Diseño',
                prompts: [
                    "Crea una paleta de colores para una app de salud",
                    "Diseña un layout para dashboard administrativo",
                    "Genera ideas para logo de startup tecnológica"
                ]
            }
        ];

        // Podrías mostrar estos ejemplos de forma interactiva
        this.mostrarEjemplosPrompts(promptExamples);
    }

    mostrarEjemplosPrompts(ejemplos) {
        // Implementación para mostrar ejemplos de forma interactiva
        // Por ejemplo, en tooltips o secciones expandibles
    }

    // Métodos para demostraciones prácticas
    generarCodigoEjemplo(prompt) {
        // Simular generación de código basado en un prompt
        return new Promise((resolve) => {
            setTimeout(() => {
                const ejemplos = {
                    'validador formulario': `function validarFormulario(formData) {
    const errores = {};
    
    // Validar nombre
    if (!formData.nombre?.trim()) {
        errores.nombre = 'El nombre es obligatorio';
    }
    
    // Validar email
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errores.email = 'Email inválido';
    }
    
    return {
        esValido: Object.keys(errores).length === 0,
        errores: errores
    };
}`,
                    'componente react': `import React, { useState } from 'react';

function CarritoCompras({ productos }) {
    const [carrito, setCarrito] = useState([]);
    
    const agregarProducto = (producto) => {
        setCarrito([...carrito, { ...producto, id: Date.now() }]);
    };
    
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    return (
        <div className="carrito">
            <h2>Carrito de Compras</h2>
            <div className="productos">
                {productos.map(producto => (
                    <Producto 
                        key={producto.id} 
                        producto={producto} 
                        onAgregar={agregarProducto}
                    />
                ))}
            </div>
            <div className="resumen">
                <p>Total: ${total}</p>
            </div>
        </div>
    );
}`
                };

                resolve(ejemplos[promrompt.toLowerCase()] || '// Código generado aparecería aquí');
            }, 1000);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.iaManager = new IAManager();
});