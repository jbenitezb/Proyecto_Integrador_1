/* ===== METODOLOGÍAS ===== */

var metodologias = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
var indiceEditando = null; // null = registrando una nueva; número = modificando esa posición

function guardar() {
    localStorage.setItem('lista_metodologias', JSON.stringify(metodologias));
}

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Minúsculas y sin tildes, para que "metodologia" encuentre "METODOLOGÍA"
function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function generarCodigo() {
    var mayor = 0;
    for (var i = 0; i < metodologias.length; i++) {
        var numero = parseInt(String(metodologias[i].codigo).replace('MET-', ''), 10);
        if (!isNaN(numero) && numero > mayor) {
            mayor = numero;
        }
    }
    return 'MET-' + String(mayor + 1).padStart(3, '0');
}

function listar() {
    var filtro = normalizar(document.getElementById('buscador').value.trim());
    var html = '';
    var mostradas = 0;

    for (var i = 0; i < metodologias.length; i++) {
        var m = metodologias[i];
        var texto = normalizar((m.codigo || '') + ' ' + (m.nombre || '') + ' ' + (m.descripcion || ''));

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;
        html += '<tr>' +
            '<td class="codigo">' + esc(m.codigo || '') + '</td>' +
            '<td>' + esc(m.nombre || '') + '</td>' +
            '<td>' + esc(m.descripcion || '') + '</td>' +
            '<td class="acciones"><button type="button" class="btn_tabla" data-indice="' + i + '">MODIFICAR</button></td>' +
            '</tr>';
    }

    if (mostradas === 0) {
        var msg = metodologias.length === 0 ? 'No hay metodologías para mostrar.' : 'No se encontraron metodologías con esa búsqueda.';
        html = '<tr><td class="vacio" colspan="4">' + msg + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = filtro === ''
        ? 'Total: ' + metodologias.length + ' metodologías'
        : 'Mostrando ' + mostradas + ' de ' + metodologias.length + ' metodologías';
}

function abrirFormulario() {
    indiceEditando = null;
    document.getElementById('formulario').reset();
    document.getElementById('codigo').value = generarCodigo();
    document.getElementById('titulo_formulario').textContent = 'Registrar metodología';
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('nombre').focus();
}

function abrirEdicion(indice) {
    var m = metodologias[indice];
    if (!m) { return; }

    indiceEditando = indice;
    document.getElementById('formulario').reset();
    document.getElementById('codigo').value = m.codigo;
    document.getElementById('nombre').value = m.nombre;
    document.getElementById('descripcion').value = m.descripcion;
    document.getElementById('titulo_formulario').textContent = 'Modificar metodología';
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    indiceEditando = null;
    document.getElementById('panel_formulario').classList.add('oculto');
}

function guardarMetodologia(evento) {
    evento.preventDefault();

    var nombre = document.getElementById('nombre').value.trim();
    var descripcion = document.getElementById('descripcion').value.trim();
    var error = document.getElementById('error_formulario');

    if (nombre.length < 3) {
        error.textContent = 'El nombre es obligatorio (mínimo 3 caracteres).';
        return;
    }
    if (descripcion === '') {
        error.textContent = 'La descripción es obligatoria.';
        return;
    }

    if (indiceEditando !== null) {
        metodologias[indiceEditando].nombre = nombre;
        metodologias[indiceEditando].descripcion = descripcion;
        aviso('Metodología modificada correctamente.', 'exito');
    } else {
        metodologias.push({
            codigo: document.getElementById('codigo').value,
            nombre: nombre,
            descripcion: descripcion,
            fechaRegistro: new Date().toISOString()
        });
        aviso('Metodología registrada correctamente.', 'exito');
    }

    guardar();
    listar();
    cerrarFormulario();
}

// Eventos
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarMetodologia);
document.getElementById('buscador').addEventListener('input', listar);

// Botón MODIFICAR de cada fila (delegación de eventos sobre el tbody)
document.getElementById('cuerpo_tabla').addEventListener('click', function (evento) {
    var boton = evento.target.closest('.btn_tabla');
    if (boton) {
        abrirEdicion(parseInt(boton.getAttribute('data-indice'), 10));
    }
});

listar();


