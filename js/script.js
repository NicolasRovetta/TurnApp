document.addEventListener('DOMContentLoaded', function() {
    // Asegúrate de que el SDK de EmailJS esté inicializado correctamente
    emailjs.init("K_2_DUDsc3R2Zf_3f"); // Reemplaza con tu User ID de EmailJS

    // El resto de tu código
    console.log("EmailJS está inicializado y listo para usarse.");
});

document.addEventListener('DOMContentLoaded', function() {
    // Variables del DOM
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const emailInput = document.getElementById('email');
    const reservarBtn = document.getElementById('reservar-btn');
    const turnosReservadosDiv = document.getElementById('turnos-reservados');
    
    // Recuperar los turnos reservados del localStorage o crear un array vacío
    let turnosReservados = JSON.parse(localStorage.getItem('turnos')) || [];

    // Mostrar los turnos reservados al cargar la página
    mostrarTurnos();

    // Evento para reservar un turno
    reservarBtn.addEventListener('click', function() {
        const fechaSeleccionada = fechaInput.value;
        const horaSeleccionada = horaInput.value;
        const emailIngresado = emailInput.value;

        // Validar que se haya seleccionado fecha, hora y un email válido
        if (fechaSeleccionada && horaSeleccionada && validarEmail(emailIngresado)) {
            reservarTurno(fechaSeleccionada, horaSeleccionada, emailIngresado);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, elige una fecha, un horario y un correo válido antes de reservar.',
            });
        }
    });

    // Función para mostrar los turnos reservados
    function mostrarTurnos() {
        turnosReservadosDiv.innerHTML = '';

        if (turnosReservados.length > 0) {
            const titulo = document.createElement('h2');
            titulo.textContent = 'Turnos reservados:';
            turnosReservadosDiv.appendChild(titulo);
        }

        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';

        turnosReservados.forEach(function(turno) {
            const turnoItem = document.createElement('li');
            turnoItem.textContent = `Turno reservado para el: ${turno.fecha} a las ${turno.hora}, Email: ${turno.email}`;
            turnoItem.style.border = '1px solid #ccc';
            turnoItem.style.borderRadius = '5px';
            turnoItem.style.padding = '10px';
            turnoItem.style.marginBottom = '10px';
            turnoItem.style.backgroundColor = '#f9f9f9';
            ul.appendChild(turnoItem);
        });

        turnosReservadosDiv.appendChild(ul);
    }

    // Función para reservar un turno
    function reservarTurno(fecha, hora, email) {
        const turno = { fecha: fecha, hora: hora, email: email };

        if (turnosReservados.some(t => t.fecha === fecha && t.hora === hora)) {
            Swal.fire({
                icon: 'warning',
                title: 'Turno ya reservado',
                text: 'Este turno ya está reservado. Por favor, elige otro horario.',
            });
        } else {
            turnosReservados.push(turno);
            localStorage.setItem('turnos', JSON.stringify(turnosReservados));
            mostrarTurnos();

            Swal.fire({
                icon: 'success',
                title: 'Turno reservado',
                text: `Tu turno ha sido reservado para el ${fecha} a las ${hora}. Te hemos enviado una confirmación a ${email}.`,
            });

            enviarEmailConfirmacion(fecha, hora, email);
        }
    }

    // Función para validar el email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Función para enviar el email de confirmación
    function enviarEmailConfirmacion(fecha, hora, email) {
        emailjs.send("service_f9f869n", "template_xlpazdh", {
            fecha: fecha,
            hora: hora,
            email: email
        })
        .then(function(response) {
            console.log('Correo enviado con éxito!', response.status, response.text);
        }, function(error) {
            console.error('Error al enviar el correo:', error);
        });
    }
});



