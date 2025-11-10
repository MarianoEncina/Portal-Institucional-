// Gestión de alumnos - CRUD completo (VERSIÓN MEJORADA)
class AlumnosManager {
    constructor() {
        this.alumnos = this.obtenerAlumnosStorage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.mostrarListadoAlumnos();
    }

    setupEventListeners() {
        // Formulario de alumno
        const formAlumno = document.getElementById('form-alumno');
        if (formAlumno) {
            formAlumno.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarAlumno();
            });
        }

        // Botón limpiar formulario
        const limpiarBtn = document.getElementById('limpiar-form');
        if (limpiarBtn) {
            limpiarBtn.addEventListener('click', () => {
                this.limpiarFormulario();
            });
        }

        // Filtro por curso
        const filtroCurso = document.getElementById('filtro-curso');
        if (filtroCurso) {
            filtroCurso.addEventListener('change', () => {
                this.mostrarListadoAlumnos();
            });
        }

        // Botón exportar
        const exportarBtn = document.getElementById('btn-exportar');
        if (exportarBtn) {
            exportarBtn.addEventListener('click', () => {
                this.exportarAlumnos();
            });
        }

        // Resetear formulario a modo nuevo cuando se navega a cargar-alumno
        document.querySelectorAll('.nav-link[data-section="cargar-alumno"], .nav-action-btn[data-section="cargar-alumno"]').forEach(btn => {
            btn.addEventListener('click', () => {
                // Pequeño delay para asegurar que la navegación ocurra primero
                setTimeout(() => {
                    this.resetearFormularioModoNuevo();
                }, 100);
            });
        });
    }

    // Función para cambiar el formulario a modo edición
    cambiarFormularioModoEdicion() {
        const titulo = document.querySelector('#cargar-alumno h2');
        const subtitulo = document.querySelector('#cargar-alumno p');
        const botonSubmit = document.querySelector('#form-alumno button[type="submit"]');

        if (titulo) titulo.textContent = 'Editar Alumno';
        if (subtitulo) subtitulo.textContent = 'Modifique los datos del alumno seleccionado';
        if (botonSubmit) {
            botonSubmit.innerHTML = '<i class="fas fa-edit mr-2"></i>Actualizar Alumno';
            botonSubmit.classList.remove('bg-[#0d9488]', 'hover:bg-[#0f766e]');
            botonSubmit.classList.add('bg-[#f59e0b]', 'hover:bg-[#d97706]');
        }
    }

    // Función para resetear el formulario a modo nuevo
    resetearFormularioModoNuevo() {
        const titulo = document.querySelector('#cargar-alumno h2');
        const subtitulo = document.querySelector('#cargar-alumno p');
        const botonSubmit = document.querySelector('#form-alumno button[type="submit"]');

        if (titulo) titulo.textContent = 'Cargar Nuevo Alumno';
        if (subtitulo) subtitulo.textContent = 'Complete el formulario para registrar un nuevo alumno en el sistema';
        if (botonSubmit) {
            botonSubmit.innerHTML = '<i class="fas fa-save mr-2"></i>Guardar Alumno';
            botonSubmit.classList.remove('bg-[#f59e0b]', 'hover:bg-[#d97706]');
            botonSubmit.classList.add('bg-[#0d9488]', 'hover:bg-[#0f766e]');
        }
    }

    guardarAlumno() {
        if (!this.validarFormulario()) {
            return;
        }

        const alumnoData = this.obtenerDatosFormulario();

        // Verificar si es edición o creación
        const alumnoId = document.getElementById('form-alumno').getAttribute('data-editing-id');

        if (alumnoId) {
            this.editarAlumno(alumnoId, alumnoData);
        } else {
            this.crearAlumno(alumnoData);
        }
    }

    obtenerDatosFormulario() {
        // CORRECIÓN: Generar ID único solo para nuevos alumnos
        const form = document.getElementById('form-alumno');
        const isEditing = form.hasAttribute('data-editing-id');

        return {
            id: isEditing ? form.getAttribute('data-editing-id') : this.generarIdUnico(),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            curso: document.getElementById('curso').value,
            fechaNacimiento: document.getElementById('fecha-nacimiento').value,
            fechaRegistro: new Date().toLocaleDateString('es-AR')
        };
    }

    generarIdUnico() {
        return 'alumno_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    validarFormulario() {
        let esValido = true;
        const campos = ['nombre', 'apellido', 'dni', 'email', 'curso'];

        // Limpiar errores previos
        this.limpiarErrores();

        campos.forEach(campo => {
            const input = document.getElementById(campo);
            const errorSpan = input.nextElementSibling;

            if (!input.value.trim()) {
                input.classList.add('input-error');
                errorSpan.classList.remove('hidden');
                esValido = false;
            }

            // Validación específica para email
            if (campo === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('input-error');
                    errorSpan.textContent = 'Ingrese un email válido';
                    errorSpan.classList.remove('hidden');
                    esValido = false;
                }
            }

            // Validación específica para DNI (debe ser único)
            if (campo === 'dni' && input.value.trim()) {
                const alumnoIdActual = document.getElementById('form-alumno').getAttribute('data-editing-id');
                const dniExistente = this.alumnos.find(alumno =>
                    alumno.dni === input.value.trim() &&
                    alumno.id !== alumnoIdActual  // CORRECIÓN: Excluir el alumno actual en edición
                );

                if (dniExistente) {
                    input.classList.add('input-error');
                    errorSpan.textContent = 'El DNI ya está registrado';
                    errorSpan.classList.remove('hidden');
                    esValido = false;
                }
            }
        });

        return esValido;
    }

    limpiarErrores() {
        document.querySelectorAll('.error-message').forEach(span => {
            span.classList.add('hidden');
        });
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
    }

    crearAlumno(alumnoData) {
        this.alumnos.push(alumnoData);
        this.guardarAlumnosStorage();
        this.mostrarMensajeExito('Alumno registrado exitosamente');
        this.limpiarFormulario();
        this.mostrarListadoAlumnos();

        // NO redirigir automáticamente al listado
        // El usuario permanece en el formulario para cargar más alumnos
    }

    editarAlumno(id, alumnoData) {
        const index = this.alumnos.findIndex(alumno => alumno.id === id);
        if (index !== -1) {
            this.alumnos[index] = {
                ...this.alumnos[index],
                ...alumnoData,
                id: id
            };

            this.guardarAlumnosStorage();
            this.mostrarMensajeExito('Alumno actualizado exitosamente');
            this.limpiarFormulario();
            this.mostrarListadoAlumnos();

            // SÍ redirigir al listado después de editar
            if (window.navigationManager) {
                setTimeout(() => {
                    window.navigationManager.showSection('listado-alumnos');
                }, 1500);
            }
        }
    }

    eliminarAlumno(id) {
        if (confirm('¿Está seguro de que desea eliminar este alumno?')) {
            this.alumnos = this.alumnos.filter(alumno => alumno.id !== id);
            this.guardarAlumnosStorage();
            this.mostrarListadoAlumnos();

            // Si estábamos editando este alumno, limpiar el formulario
            const form = document.getElementById('form-alumno');
            if (form.getAttribute('data-editing-id') === id) {
                this.limpiarFormulario();
            }
        }
    }

    cargarAlumnoParaEdicion(id) {
        const alumno = this.alumnos.find(a => a.id === id);
        if (alumno) {
            document.getElementById('nombre').value = alumno.nombre || '';
            document.getElementById('apellido').value = alumno.apellido || '';
            document.getElementById('dni').value = alumno.dni || '';
            document.getElementById('email').value = alumno.email || '';
            document.getElementById('telefono').value = alumno.telefono || '';
            document.getElementById('curso').value = alumno.curso || '';
            document.getElementById('fecha-nacimiento').value = alumno.fechaNacimiento || '';

            // Marcar formulario como en edición y cambiar a modo edición
            const form = document.getElementById('form-alumno');
            form.setAttribute('data-editing-id', id);
            this.cambiarFormularioModoEdicion();

            // Navegar a la sección de formulario
            if (window.navigationManager) {
                window.navigationManager.showSection('cargar-alumno');
            }
        }
    }

    limpiarFormulario() {
        const form = document.getElementById('form-alumno');
        if (form) {
            form.reset();
            form.removeAttribute('data-editing-id');
            this.resetearFormularioModoNuevo();
        }

        this.limpiarErrores();
        this.ocultarMensajeExito();
    }

    mostrarListadoAlumnos() {
        const tbody = document.getElementById('tabla-alumnos-body');
        const mensajeSinDatos = document.getElementById('mensaje-sin-datos');
        const filtroCurso = document.getElementById('filtro-curso');

        if (!tbody) return;

        // Filtrar alumnos por curso si hay filtro activo
        let alumnosFiltrados = this.alumnos;
        if (filtroCurso && filtroCurso.value) {
            alumnosFiltrados = this.alumnos.filter(alumno => alumno.curso === filtroCurso.value);
        }

        // Ordenar por apellido y nombre
        alumnosFiltrados.sort((a, b) => {
            const apellidoCompare = a.apellido.localeCompare(b.apellido);
            if (apellidoCompare !== 0) return apellidoCompare;
            return a.nombre.localeCompare(b.nombre);
        });

        if (alumnosFiltrados.length === 0) {
            tbody.innerHTML = '';
            if (mensajeSinDatos) mensajeSinDatos.classList.remove('hidden');
            return;
        }

        if (mensajeSinDatos) mensajeSinDatos.classList.add('hidden');

        tbody.innerHTML = alumnosFiltrados.map(alumno => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-3">
                    <div>
                        <p class="font-medium text-gray-900">${alumno.nombre} ${alumno.apellido}</p>
                        ${alumno.fechaNacimiento ? `<p class="text-sm text-gray-500">Nac: ${alumno.fechaNacimiento}</p>` : ''}
                    </div>
                </td>
                <td class="px-4 py-3 text-gray-700">${alumno.dni}</td>
                <td class="px-4 py-3">
                    <a href="mailto:${alumno.email}" class="text-[#0369a1] hover:text-[#0d9488] transition">${alumno.email}</a>
                </td>
                <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e0f2fe] text-[#0369a1]">
                        ${alumno.curso}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex space-x-2">
                        <button onclick="window.alumnosManager.cargarAlumnoParaEdicion('${alumno.id}')" 
                                class="text-[#0d9488] hover:text-[#0f766e] transition p-2 rounded-lg hover:bg-blue-50" 
                                title="Editar alumno">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.alumnosManager.eliminarAlumno('${alumno.id}')" 
                                class="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50" 
                                title="Eliminar alumno">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    mostrarMensajeExito(mensaje) {
        const mensajeExito = document.getElementById('mensaje-exito');
        if (mensajeExito) {
            const span = mensajeExito.querySelector('span');
            if (span) span.textContent = mensaje;
            mensajeExito.classList.remove('hidden');

            setTimeout(() => {
                this.ocultarMensajeExito();
            }, 5000);
        }
    }

    ocultarMensajeExito() {
        const mensajeExito = document.getElementById('mensaje-exito');
        if (mensajeExito) {
            mensajeExito.classList.add('hidden');
        }
    }

    exportarAlumnos() {
        const filtroCurso = document.getElementById('filtro-curso');
        let alumnosAExportar = this.alumnos;

        if (filtroCurso && filtroCurso.value) {
            alumnosAExportar = this.alumnos.filter(alumno => alumno.curso === filtroCurso.value);
        }

        if (alumnosAExportar.length === 0) {
            alert('No hay alumnos para exportar');
            return;
        }

        // Crear CSV
        const headers = ['Nombre', 'Apellido', 'DNI', 'Email', 'Teléfono', 'Curso', 'Fecha Nacimiento', 'Fecha Registro'];
        const csvContent = [
            headers.join(','),
            ...alumnosAExportar.map(alumno => [
                `"${alumno.nombre}"`,
                `"${alumno.apellido}"`,
                `"${alumno.dni}"`,
                `"${alumno.email}"`,
                `"${alumno.telefono || ''}"`,
                `"${alumno.curso}"`,
                `"${alumno.fechaNacimiento || ''}"`,
                `"${alumno.fechaRegistro}"`
            ].join(','))
        ].join('\n');

        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `alumnos_${filtroCurso?.value || 'todos'}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Local Storage
    obtenerAlumnosStorage() {
        try {
            const alumnos = localStorage.getItem('instituto_alumnos');
            return alumnos ? JSON.parse(alumnos) : [];
        } catch (error) {
            console.error('Error al cargar alumnos del storage:', error);
            return [];
        }
    }

    guardarAlumnosStorage() {
        try {
            localStorage.setItem('instituto_alumnos', JSON.stringify(this.alumnos));
        } catch (error) {
            console.error('Error al guardar alumnos en storage:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.alumnosManager = new AlumnosManager();
});