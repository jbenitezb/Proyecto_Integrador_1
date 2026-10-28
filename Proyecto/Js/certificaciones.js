
/* ===== CATÁLOGO DE CERTIFICACIONES ===== */

let certificaciones = JSON.parse(localStorage.getItem('certificaciones')) || [];
let editando = null; // null = registrando; número = editando esa posición

function guardar() {
    localStorage.setItem('certificaciones', JSON.stringify(certificaciones));
}

function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Minúsculas y sin tildes, para facilitar la búsqueda
function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    const caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    const filtro = normalizar(
        document.getElementById('buscadorCertificaciones').value.trim()
    );

    let html = '';
    let mostradas = 0;

    for (let i = 0; i < certificaciones.length; i++) {
        const certificacion = certificaciones[i];

        const texto = normalizar(
            certificacion.codigo + ' ' +
            certificacion.nombre + ' ' +
            certificacion.descripcion
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(certificacion.codigo) + '</td>' +
            '<td>' + esc(certificacion.nombre) + '</td>' +
            '<td>' + esc(certificacion.descripcion) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' + i + '">' +
                    'EDITAR' +
                '</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        const mensaje = certificaciones.length === 0
            ? 'No hay certificaciones para mostrar.'
            : 'No se encontraron certificaciones con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('tablaCertificacionesBody').innerHTML = html;

    document.getElementById('conteo').textContent ='Mostrando ' + mostradas + ' de ' + certificaciones.length + ' certificaciones';
}

function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar casa certificadora o certificación';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= certificaciones.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar casa certificadora o certificación';

    document.getElementById('codigo').value = certificaciones[i].codigo;
    document.getElementById('nombre').value = certificaciones[i].nombre;
    document.getElementById('descripcion').value = certificaciones[i].descripcion;

    // El código no se puede cambiar al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}

function guardarCertificacion(evento) {
    evento.preventDefault();

    const codigo = document.getElementById('codigo').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const error = document.getElementById('error_formulario');

    error.textContent = '';

    if (codigo === '' && nombre === '' && descripcion === '') {
        error.textContent = 'El código, el nombre y la descripción son obligatorios.';
        return;
    }

    if (codigo === '' && nombre === '') {
        error.textContent = 'El código y el nombre son obligatorios.';
        return;
    }

    if (codigo === '' && descripcion === '') {
        error.textContent = 'El código y la descripción son obligatorios.';
        return;
    }

    if (nombre === '' && descripcion === '') {
        error.textContent = 'El nombre y la descripción son obligatorios.';
        return;
    }

    if (codigo === '') {
        error.textContent = 'El código es obligatorio.';
        return;
    }

    if (nombre === '') {
        error.textContent = 'El nombre es obligatorio.';
        return;
    }

    if (descripcion === '') {
        error.textContent = 'La descripción es obligatoria.';
        return;
    }

    for (let i = 0; i < certificaciones.length; i++) {
        if (
            certificaciones[i].codigo.toUpperCase() === codigo &&
            i !== editando
        ) {
            error.textContent = 'Ya existe una certificación con este código.';
            return;
        }
    }

    const certificacion = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion
    };

    if (editando === null) {
        certificaciones.push(certificacion);
        aviso('Certificación registrada correctamente.', 'exito');
    } else {
        certificaciones[editando] = certificacion;
        aviso('Certificación modificada correctamente.', 'exito');
    }

    guardar();
    listar();
    cerrarFormulario();
}
// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarCertificacion);
document.getElementById('buscadorCertificaciones').addEventListener('input', listar);
document.getElementById('tablaCertificacionesBody').addEventListener('click', function (evento) {
        const boton = evento.target.closest('.btn_tabla');

        if (boton) {
            editar(parseInt(boton.getAttribute('data-indice'), 10));
        }
    });

listar();