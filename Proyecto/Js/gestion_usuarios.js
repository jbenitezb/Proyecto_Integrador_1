document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de usuarios del localStorage de forma dinámica
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    
    const cuerpoTabla = document.getElementById('cuerpo_tabla_usuarios');
    const conteoUsuarios = document.getElementById('conteo_usuarios');
    const errorFormulario = document.getElementById('error_formulario');

    // Ocultar mensajes al cargar
    if (errorFormulario) {
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }

    const guardarEnStorage = () => {
        localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    };

    const mostrarAviso = (mensaje, esExito = false) => {
        if (errorFormulario) {
            errorFormulario.className = esExito ? 'aviso exito campo_completo' : 'error campo_completo';
            errorFormulario.textContent = mensaje;
            errorFormulario.classList.remove('oculto');
            
            if (esExito) {
                setTimeout(() => {
                    errorFormulario.classList.add('oculto');
                }, 3000);
            }
        }
    };

    //HU-13 Función para renderizar el panel de administración de la 
    const cargarPanelAdministracion = () => {
        cuerpoTabla.innerHTML = '';

        if (usuarios.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">No hay solicitudes ni usuarios registrados en el sistema.</td></tr>`;
            if (conteoUsuarios) conteoUsuarios.textContent = 'Total de registros en el sistema: 0';
            return;
        }

        usuarios.forEach((usuario, index) => {
            const fila = document.createElement('tr');

            const estadoActual = usuario.estado || 'Pendiente';
            const rolActual = usuario.rol || 'Sin Asignar';

            fila.innerHTML = `
                <td>${usuario.identificacion}</td>
                <td>${usuario.nombre} ${usuario.apellidos}</td>
                <td>${usuario.correo}</td>
                <td>
                    <select class="formulario_input select_estado" data-index="${index}" style="padding: 6px; font-size: 0.85rem;">
                        <option value="Pendiente" ${estadoActual === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Activo" ${estadoActual === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${estadoActual === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </td>
                <td>
                    <select class="formulario_input select_rol" data-index="${index}" style="padding: 6px; font-size: 0.85rem;">
                        <option value="Sin Asignar" ${rolActual === 'Sin Asignar' ? 'selected' : ''}>Seleccione...</option>
                        <option value="Rectoría" ${rolActual === 'Rectoría' ? 'selected' : ''}>Rectoría</option>
                        <option value="Vicerrectoría" ${rolActual === 'Vicerrectoría' ? 'selected' : ''}>Vicerrectoría</option>
                        <option value="Desarrollo Curricular" ${rolActual === 'Desarrollo Curricular' ? 'selected' : ''}>Desarrollo Curricular</option>
                        <option value="Director de Escuela" ${rolActual === 'Director de Escuela' ? 'selected' : ''}>Director de Escuela</option>
                    </select>
                </td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <!-- Sin estilos en línea para que use al 100% la clase .btn_tabla del CSS -->
                        <button type="button" class="btn_tabla btn_guardar" data-index="${index}">Guardar</button>
                    </div>
                </td>
            `;

            cuerpoTabla.appendChild(fila);
        });

        if (conteoUsuarios) {
            conteoUsuarios.textContent = `Total de registros en el sistema: ${usuarios.length}`;
        }

        // Lógica del botón Guardar actualiza Estado y Rol con validación de unicidad de Rectoría/Vicerrectoría
        document.querySelectorAll('.btn_guardar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const selectEstado = document.querySelector(`.select_estado[data-index="${index}"]`);
                const selectRol = document.querySelector(`.select_rol[data-index="${index}"]`);
                
                const nuevoEstado = selectEstado.value;
                const nuevoRol = selectRol.value;

              // 🟢 Validar regla de negocio: Roles gerenciales exclusivos únicos
                if (nuevoRol === 'Rectoría' || nuevoRol === 'Vicerrectoría') {
                    const rolOcupadoPorOtro = usuarios.some((u, i) => i !== parseInt(index) && u.rol === nuevoRol);
                    if (rolOcupadoPorOtro) {
                        mostrarAviso(`Error: Ya existe un usuario asignado con el rol exclusivo de "${nuevoRol}". Solo puede haber uno.`, false);
                        return;
                    }
                }

                // Actualizar datos del usuario seleccionado
                usuarios[index].estado = nuevoEstado;
                usuarios[index].rol = nuevoRol;
                
                guardarEnStorage();
                cargarPanelAdministracion();

                mostrarAviso(`¡Cambios guardados con éxito para ${usuarios[index].nombre}!`, true);
            });
        });
    };

    // Inicializar carga al abrir la vista
    cargarPanelAdministracion();
});