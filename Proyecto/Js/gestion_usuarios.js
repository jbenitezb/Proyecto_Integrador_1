document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de usuarios del localStorage de forma dinámica
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    
    const cuerpoTabla = document.getElementById('cuerpo_tabla_usuarios');
    const conteoUsuarios = document.getElementById('conteo_usuarios');
    const errorFormulario = document.getElementById('error_formulario');

    const inputBuscar = document.getElementById('buscador_usuarios');
    const btnBuscar = document.getElementById('btn_buscar');
    const btnLimpiar = document.getElementById('btn_limpiar_busqueda');
    const btnRegistrar = document.getElementById('btn_registrar');

    // Ocultar mensajes al cargar
    if (errorFormulario) {
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }

    if (btnRegistrar) {
    btnRegistrar.addEventListener('click', () => {
        window.location.href = 'registrar_adentro.html';
    });
    }

    const normalizar = (texto) => {
        return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    // Función auxiliar para calcular la edad por si algún registro no la trae guardada
        const calcularEdad = (fechaNacimientoStr) => {
            if (!fechaNacimientoStr) return 'N/D';
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimientoStr);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            return `${edad} años`;
        };
    
    // Función para renderizar el listado en la tabla (Criterio 3)
    const renderizarTabla = () => {
        const filtro = normalizar(inputBuscar ? inputBuscar.value.trim() : '');

        cuerpoTabla.innerHTML = '';
        let mostradas = 0;

      usuarios.forEach((usuario) => {
            const primerAp = usuario.primerApellido || usuario.apellidos || '';
            const segundoAp = usuario.segundoApellido || '';
            const nombreCompleto = `${usuario.nombre || ''} ${primerAp} ${segundoAp}`.trim();

            // Unimos los campos en un solo texto normalizado para buscar de golpe
            const textoBusqueda = normalizar(
                (usuario.identificacion || '') + ' ' +
                nombreCompleto + ' ' +
                (usuario.correo || '') + ' ' +
                (usuario.telefono || '')
            );

            // Si hay un texto en el buscador y no coincide, se salta este usuario
            if (filtro !== '' && textoBusqueda.indexOf(filtro) === -1) {
                return;
            }

            mostradas++;
            const fila = document.createElement('tr');
            const edadCalculada = usuario.edadCalculada || calcularEdad(usuario.fechaNacimiento);

            fila.innerHTML = `
                <td style="font-weight: bold; color: #084599;">${usuario.identificacion || 'N/D'}</td>
                <td>${nombreCompleto || 'N/D'}</td>
                <td>${usuario.correo || 'N/D'}</td>
                <td>${usuario.telefono || 'N/D'}</td>
                <td>${usuario.sexo || 'N/D'}</td>
                <td>${edadCalculada}</td>
            `;

            cuerpoTabla.appendChild(fila);
        });

        // Si no hay resultados tras la búsqueda
        if (mostradas === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">No se encontraron usuarios con esa búsqueda.</td></tr>`;
        }

        // Actualizar el contador de registros
        if (conteoUsuarios) {
            conteoUsuarios.textContent = `Total de registros en el sistema: ${mostradas} de ${usuarios.length}`;
        }
    };

    if (inputBuscar) {
        inputBuscar.addEventListener('input', renderizarTabla);
    }
    // Inicializar la tabla al cargar la vista
    renderizarTabla(usuarios);
});