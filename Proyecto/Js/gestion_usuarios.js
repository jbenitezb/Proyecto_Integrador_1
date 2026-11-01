document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de usuarios del localStorage de forma dinámica
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    
    const cuerpoTabla = document.getElementById('cuerpo_tabla_usuarios');
    const conteoUsuarios = document.getElementById('conteo_usuarios');
    const errorFormulario = document.getElementById('error_formulario');

    const inputBuscar = document.getElementById('buscador_usuarios');
    const btnBuscar = document.getElementById('btn_buscar');
    const btnLimpiar = document.getElementById('btn_limpiar_busqueda');

    // Ocultar mensajes al cargar
    if (errorFormulario) {
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }
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
    const renderizarTabla = (listaAVisualizar) => {
        cuerpoTabla.innerHTML = '';

        if (listaAVisualizar.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">No hay usuarios registrados en el sistema.</td></tr>`;
            if (conteoUsuarios) conteoUsuarios.textContent = 'Total de registros en el sistema: 0';
            return;
        }

        listaAVisualizar.forEach((usuario) => {
            const fila = document.createElement('tr');
            const edadCalculada = calcularEdad(usuario.fechaNacimiento);

            fila.innerHTML = `
                <td style="font-weight: bold; color: #084599;">${usuario.identificacion || 'N/D'}</td>
                <td>${usuario.nombre || ''} ${usuario.apellidos || ''}</td>
                <td>${usuario.correo || 'N/D'}</td>
                <td>${usuario.telefono || 'N/D'}</td>
                <td>${usuario.genero || 'N/D'}</td>
                <td>${edadCalculada}</td>
            `;

            cuerpoTabla.appendChild(fila);
        });

        if (conteoUsuarios) {
            conteoUsuarios.textContent = `Total de registros en el sistema: ${listaAVisualizar.length}`;
        }
    };
// Función de Búsqueda (Criterio 4 de la Rúbrica: identificación, nombre, apellidos o correo)
    const ejecutarBusqueda = () => {
        const termino = inputBuscar.value.trim().toLowerCase();
        if (termino === '') {
            renderizarTabla(usuarios);
            return;
        }

        const resultados = usuarios.filter(u => {
            const id = (u.identificacion || '').toLowerCase();
            const nombre = (u.nombre || '').toLowerCase();
            const apellidos = (u.apellidos || '').toLowerCase();
            const correo = (u.correo || '').toLowerCase();

            return id.includes(termino) || 
                   nombre.includes(termino) || 
                   apellidos.includes(termino) || 
                   correo.includes(termino);
        });

        renderizarTabla(resultados);
    };

    // Eventos de búsqueda
    if (btnBuscar) {
        btnBuscar.addEventListener('click', ejecutarBusqueda);
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                ejecutarBusqueda();
            }
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            inputBuscar.value = '';
            renderizarTabla(usuarios);
        });
    }

    // Inicializar la tabla al cargar la vista
    renderizarTabla(usuarios);
});