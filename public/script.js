// //funcion para ver la foto de perfil
// function previewProfilePic(event) {
//     const input = event.target;
//     const preview = document.getElementById('profilePicPreview');
//     if (input.files && input.files[0]) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             preview.src = e.target.result;
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }



//// Functions

// Login function
const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/dashboard/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        Swal.fire({
            title: 'Success!',
            text: `Welcome ${data.holder.username}`,
            icon: 'success',
            confirmButtonText: 'Access Dashboard',
            timer: 2000
        } ).then(() => {
           closeAllModals();
        });

    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
}

// Register function
const register = async () => {
    const username = document.getElementById('userName').value;
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;

    try {
        const response = await fetch('/dashboard/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();

        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        registerModal.hide();

        Swal.fire({
            title: 'Success!',
            text: `Welcome ${data.holder.username}`,
            icon: 'success',
            confirmButtonText: 'Nice'
        }).then(() => {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();

            document.getElementById('email').value = email;

        });

    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
}



//// Modales

// Mostrar el modal de login al cargar la pagina
document.addEventListener('DOMContentLoaded', function () {
    let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    toggleModalEffects(true);
});
// Cambio de modales, login a registro y viceversa
document.querySelector('#loginModal .btn-secondary').addEventListener('click', function () {
    let loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();

    let registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
    toggleModalEffects(true);
});
document.querySelector('#registerModal .btn-secondary').addEventListener('click', function () {
    let registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();

    let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    toggleModalEffects(true);
});
// Cerrar todos los modales
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modalEl => {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    });
    toggleModalEffects(false);
}
// Function to toggle modal effects
function toggleModalEffects(enable) {
    document.getElementById('container').classList.toggle('modal-active', enable);
}



// SweetAlert2 for error handling
document.querySelectorAll('.open-sweet-alert').forEach(button => {
    button.addEventListener('click', function () {
        Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'Cool'
        });

        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        toggleModalEffects(true);
    });
});