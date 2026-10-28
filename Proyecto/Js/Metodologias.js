/* ===== CATÁLOGO DE METODOLOGÍAS ===== */

console.log('METODOLOGÍAS: archivo actualizado');

let metodologias = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
let editando = null;

function guardar() {
    localStorage.setItem('lista_metodologias', JSON.stringify(metodologias));
}

function esc(texto) {
    return String(texto ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function normalizar(texto) {
    return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    const caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    const filtro = normalizar(document.getElementById('buscadorMetodologias').value.trim());

    let html = '';
    let mostradas = 0;

    for (let i = 0; i < metodologias.length; i++) {
        const metodologia = metodologias[i];

        const texto = normalizar(
            metodologia.codigo + ' ' +
            metodologia.nombre + ' ' +
            metodologia.descripcion
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(metodologia.codigo) + '</td>' +
            '<td>' + esc(metodologia.nombre) + '</td>' +
            '<td>' + esc(metodologia.descripcion) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' + i + '">EDITAR</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        const mensaje = metodologias.length === 0
            ? 'No hay metodologías para mostrar.'
            : 'No se encontraron metodologías con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' + mensaje + '</td></tr>';
    }

    document.getElementById('tablaMetodologiasBody').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' + metodologias.length + ' metodologías';
}

function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent = 'Registrar nueva metodología';
    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= metodologias.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent = 'Modificar metodología';
    document.getElementById('codigo').value = metodologias[i].codigo;
    document.getElementById('nombre').value = metodologias[i].nombre;
    document.getElementById('descripcion').value = metodologias[i].descripcion;

    document.getElementById('codigo').readOnly = true;
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}

function guardarMetodologia(evento) {
    evento.preventDefault();

    const codigo = document.getElementById('codigo').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const error = document.getElementById('error_formulario');

    error.textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    if (codigo === '') {
        error.textContent = 'Ingrese un código válido.';
        return;
    }

    if (nombre === '' || nombre.length < 3) {
        error.textContent = 'Ingrese un nombre válido (mínimo 3 caracteres).';
        return;
    }

    if (descripcion === '') {
        error.textContent = 'Ingrese la descripción de la metodología.';
        return;
    }

    const codigoExiste = metodologias.some((metodologia, i) =>
        metodologia.codigo.toUpperCase() === codigo && i !== editando
    );

    if (codigoExiste) {
        error.textContent = 'Ya existe una metodología con este código.';
        return;
    }

    const esNuevo = editando === null;

    const metodologia = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion
    };

    if (esNuevo) {
        metodologias.push(metodologia);
    } else {
        metodologias[editando] = metodologia;
    }

    guardar();
    listar();
    cerrarFormulario();

    aviso(
        esNuevo
            ? 'Metodología registrada correctamente.'
            : 'Metodología modificada correctamente.',
        'exito'
    );
}

// Acciones
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarMetodologia);
document.getElementById('buscadorMetodologias').addEventListener('input', listar);

document.getElementById('tablaMetodologiasBody').addEventListener('click', function(evento) {
    const boton = evento.target.closest('.btn_tabla');

    if (boton) {
        editar(parseInt(boton.getAttribute('data-indice'), 10));
    }
});

listar();