if (sessionStorage.getItem('sesion')) {
    window.location.replace('inicio_para_catalogos.html');
}

var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

if (usuarios.length === 0) {
    usuarios.push({ nombre: 'Administrador', correo: 'admin@ucenfotec.ac.cr', contrasena: 'Admin123' });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function iniciarSesion(evento) {
    evento.preventDefault();

    var correo = document.getElementById('correo').value.trim().toLowerCase();
    var contrasena = document.getElementById('contrasena').value;
    var error = document.getElementById('error_formulario');

    if (correo === '' && contrasena === '') {
        error.textContent = 'El correo y la contraseña son obligatorios.';
        return;
    }

    if (correo === '') {
        error.textContent = 'El correo es obligatorio.';
        return;
    }

    if (contrasena === '') {
        error.textContent = 'La contraseña es obligatoria.';
        return;
    }

    for (var i = 0; i < usuarios.length; i++) {
        if (String(usuarios[i].correo).toLowerCase() === correo && usuarios[i].contrasena === contrasena) {
            sessionStorage.setItem('sesion', JSON.stringify({ correo: usuarios[i].correo, nombre: usuarios[i].nombre || '' }));
            window.location.replace('inicio_para_catalogos.html');
            return;
        }
    }

    error.textContent = 'Correo o contraseña incorrectos.';
}

document.getElementById('formulario').addEventListener('submit', iniciarSesion);
