var areas = JSON.parse(localStorage.getItem('area_sfia')) || [];

function guardar() {
    localStorage.setItem('area_sfia', JSON.stringify(areas));
}

function esc(texto) {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    var html = '';
    var total = 0;

    for (var i = 0; i < areas.length; i++) {
        var a = areas[i];
        total++;
        html += '<tr>' +
            '<td class="codigo">' + esc(a.codigo) + '</td>' +
            '<td>' + esc(a.nombre) + '</td>' +
            '<td>' + esc(a.descripcion) + '</td>' +
            '</tr>';
    }

    if (total === 0) {
        html = '<tr><td class="vacio" colspan="3">No hay áreas para mostrar.</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Total: ' + areas.length + ' áreas';
}

function abrirFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function cerrarFormulario() {
    document.getElementById('panel_formulario').classList.add('oculto');
}

function guardarArea(evento) {
    evento.preventDefault();

    var codigo = document.getElementById('codigo').value.trim().toUpperCase();
    var nombre = document.getElementById('nombre').value.trim();
    var descripcion = document.getElementById('descripcion').value.trim();
    var error = document.getElementById('error_formulario');

    if (codigo === '' || nombre === '') {
        error.textContent = 'El código y el nombre son obligatorios.';
        return;
    }

    for (var i = 0; i < areas.length; i++) {
        if (areas[i].codigo === codigo) {
            error.textContent = 'Ya existe un área con este código.';
            return;
        }
    }

    var area = { codigo: codigo, nombre: nombre, descripcion: descripcion };

    areas.push(area);
    aviso('Área registrada correctamente.', 'exito');

    guardar();
    listar();
    cerrarFormulario();
}

listar();
