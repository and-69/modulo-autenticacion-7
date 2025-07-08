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
        }).then(() => {
            closeAllModals();
            document.getElementById('usuarioName').textContent = data.holder.username;
            localStorage.setItem('token', data.token)
            toggleModalEffects(false)
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

        const data = await response.json();
        if (!response.ok) {
            let errorMsg = 'Registro fallido';
            let errorTitle = 'Error en el registro';
            if (data.errors && data.errors.length > 0) {
                const messages = data.errors.map(e => e.msg).join('\n');
                Swal.fire({
                    title: 'Errores en el registro',
                    text: messages,
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            Swal.fire({
                title: errorTitle,
                text: errorMsg,
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }
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

// Profile function
const profile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found')
        }
        const response = await fetch('/dashboard/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if (!response.ok) {


            if (response.status === 401) {
                Swal.fire({
                    title: 'Sesión expirada',
                    text: 'Por favor inicia sesión de nuevo.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    localStorage.removeItem('token');
                    let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                    toggleModalEffects(true);
                    console.log(response);
                });
                return false;
            }
            throw new Error('No autorizado o error en la consulta de perfil');
        }
        const data = await response.json();
        console.log('Profile data:', data);

        return true
    } catch (error) {
        console.error('Profile error:', error);

        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
}


//function password ocult
function togglePasswordRegister() {
    const input = document.getElementById('passwordRegister');
    const icon = document.getElementById('eyeIconRegister');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

//function limpiar modales


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

const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
    settingsBtn.addEventListener('click', async () => {
        const ok = await profile();
        if (ok) window.location.href = 'settings.html';
    });
}

function backToDashboard() {
    sessionStorage.setItem('hideModals', 'true');
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}