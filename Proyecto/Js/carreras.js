
/* ===== CATÁLOGO DE CARRERAS ===== */

var carreras = JSON.parse(localStorage.getItem('carreras')) || [];
var escuelas = JSON.parse(localStorage.getItem('escuelas')) || [];
var editando = null;

// Guardar carreras
function guardar() {
    localStorage.setItem('carreras', JSON.stringify(carreras));
}

// Escapar texto para mostrarlo en la tabla
function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Normalizar texto para buscar sin distinguir mayúsculas ni tildes
function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Actualizar las escuelas guardadas
function actualizarEscuelas() {
    escuelas = JSON.parse(localStorage.getItem('escuelas')) || [];
}

// Obtener el nombre de una escuela a partir de su código
function obtenerNombreEscuela(codigo) {
    var escuela = escuelas.find(function(item) {
        return item.codigo === codigo;
    });

    return escuela ? escuela.nombre : 'Escuela no encontrada';
}

// Mostrar avisos
function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

// Cargar las escuelas en el select
function cargarEscuelas() {
    actualizarEscuelas();

    var select = document.getElementById('escuela');
    var codigoSeleccionado = select.value;

    select.innerHTML =
        '<option value="">Seleccione una escuela</option>';

    escuelas.forEach(function(escuela) {
        var opcion = document.createElement('option');
        opcion.value = escuela.codigo;
        opcion.textContent = escuela.nombre;
        select.appendChild(opcion);
    });

    // Conservar la selección si sigue existiendo
    select.value = codigoSeleccionado;
}

// Listar y buscar carreras
function listar() {
    actualizarEscuelas();

    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );
    

    var html = '';
    var mostradas = 0;

    for (var i = 0; i < carreras.length; i++) {
        var carrera = carreras[i];
        var nombreEscuela = obtenerNombreEscuela(carrera.escuela);

        var texto = normalizar(
            carrera.codigo + ' ' +
            carrera.nombre + ' ' +
            nombreEscuela
        );

        if (filtro !== '' && !texto.includes(filtro)) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(carrera.codigo) + '</td>' +
            '<td>' + esc(carrera.nombre) + '</td>' +
            '<td>' + esc(nombreEscuela) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' +
                i + '">' +
                    'EDITAR' +
                '</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        var mensaje = carreras.length === 0
            ? 'No hay carreras para mostrar.'
            : 'No se encontraron carreras con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' +
        carreras.length + ' carreras';
}

// Abrir formulario para registrar
function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar carrera';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    cargarEscuelas();

    document.getElementById('panel_formulario')
        .classList.remove('oculto');

    document.getElementById('codigo').focus();
}

// Editar una carrera
function editar(i) {
    if (i < 0 || i >= carreras.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar carrera';

    document.getElementById('codigo').value = carreras[i].codigo;
    document.getElementById('nombre').value = carreras[i].nombre;

    // Seleccionar la escuela asociada que ya tenía la carrera
    document.getElementById('escuela').value = carreras[i].escuela;

    // No permitir cambiar el código al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

// Cerrar formulario
function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario')
        .classList.add('oculto');

    document.getElementById('error_formulario').textContent = '';
}

// Registrar o modificar una carrera
function guardarCarrera(evento) {
    evento.preventDefault();

    var codigo = document.getElementById('codigo')
        .value.trim().toUpperCase();

    var nombre = document.getElementById('nombre')
        .value.trim();

    var escuela = document.getElementById('escuela').value;

    var error = document.getElementById('error_formulario');

     if (codigo === '') {
        error.textContent = 'Ingrese un código válido.';
        return;
    }

    if (nombre === '' || nombre.length < 3) {
        error.textContent = 'Ingrese el nombre de la escuela (mínimo 3 caracteres).';
        return;
    }

    if (escuela === '') {
        error.textContent = 'Seleccione una escuela válida.';
        return;
    }

    // Evitar códigos duplicados
    for (var i = 0; i < carreras.length; i++) {
        if (carreras[i].codigo.toUpperCase() === codigo &&i !== editando) {
            error.textContent =
                'Ya existe una carrera con este código.';
            return;
        }
    }

    var carrera = {
        codigo: codigo,
        nombre: nombre,
        escuela: escuela
    };

    if (editando === null) {
        carreras.push(carrera);
        aviso('Carrera registrada correctamente.', 'exito');
    } else {
        carreras[editando] = carrera;
        aviso('Carrera modificada correctamente.', 'exito');
    }

    guardar();
    listar();
    cerrarFormulario();
}

// Eventos
document.getElementById('btn_registrar')
    .addEventListener('click', abrirFormulario);

document.getElementById('btn_cancelar')
    .addEventListener('click', cerrarFormulario);

document.getElementById('formulario')
    .addEventListener('submit', guardarCarrera);

document.getElementById('buscador')
    .addEventListener('input', listar);

document.getElementById('cuerpo_tabla')
    .addEventListener('click', function(evento) {
        var boton = evento.target.closest('.btn_tabla');

        if (boton) {
            editar(parseInt(boton.getAttribute('data-indice'), 10));
        }
    });

// Inicializar catálogo
cargarEscuelas();
listar();
