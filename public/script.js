// //funcion para ver la foto de perfil
function previewProfilePic(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('profilePicPreview');
        if (preview) preview.src = e.target.result;
        const email = localStorage.getItem('currentUserEmail');
        if (email) {
            localStorage.setItem(`profilePic_${email}`, e.target.result);
        }
    };
    reader.readAsDataURL(file);
}



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
            localStorage.setItem('currentUserEmail', data.holder.email);
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

// ProfileEdit function
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
const profileEdit = async () => {
    const username = document.getElementById('userName')?.value;
    const email = document.getElementById('emailRegister')?.value;
    const password = document.getElementById('passwordRegister')?.value;
    const token = localStorage.getItem('token');

    const body = {};
    if (username) body.username = username;
    if (email) body.email = email;
    if (password) body.password = password;

    try {
        const response = await fetch('/dashboard/profile/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            let msg = data.msg || 'Error al actualizar el perfil';
            if (data.errors && data.errors.length > 0) {
                msg = data.errors.map(e => e.msg).join('\n');
            }
            throw new Error(msg);
        }

        Swal.fire({
            title: 'Perfil actualizado',
            text: data.msg,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            if (data.holder && data.holder.username) {
                const usuarioName = document.getElementById('usuarioName');
                if (usuarioName) usuarioName.textContent = data.holder.username;
            }
            window.location.href = 'index.html';
            closeAllModals();
        });

    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
    }
};

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

//// Modales

// Mostrar el modal de login al cargar la pagina
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        toggleModalEffects(true);
    } else {
        toggleModalEffects(false);
        const usuarioName = document.getElementById('usuarioName');
        if (usuarioName) {
            try {
                const response = await fetch('/dashboard/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.holder && data.holder.username) {
                        usuarioName.textContent = data.holder.username;
                    }
                } else {
                    localStorage.removeItem('token');
                    let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                    toggleModalEffects(true);
                }
            } catch (e) {
                localStorage.removeItem('token');
                let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
                toggleModalEffects(true);
            }
        }
    }
    const preview = document.getElementById('profilePicPreview');
    const savedPic = localStorage.getItem('profilePic');
    if (preview && savedPic) {
        preview.src = savedPic;
    }
    const dashboardPic = document.getElementById('dashboardProfilePic');
    const email = localStorage.getItem('currentUserEmail');
    let savedPic1 = null;
    if (email) {
        savedPic1 = localStorage.getItem(`profilePic_${email}`);
    }
    if (dashboardPic) {
        dashboardPic.src = savedPic1 || 'img/pngegg.png';
    }
});

const loginBtn = document.querySelector('#loginModal .btn-secondary');
if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        let loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();

        let registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
        toggleModalEffects(true);
    });
}
const registerBtn = document.querySelector('#registerModal .btn-primary');
if (registerBtn) {
    registerBtn.addEventListener('click', function () {
        let registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        registerModal.hide();

        let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        toggleModalEffects(true);
    });
}
// Cerrar todos los modales
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modalEl => {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    });
    toggleModalEffects(false);
}
// Function to toggle modal effects
function toggleModalEffects(show) {
    const mainContent = document.getElementById('container');
    if (!mainContent) return;
    if (show) {
        mainContent.classList.add('blur');
    } else {
        mainContent.classList.remove('blur');
    }
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
const limpiarModalRegistro = () => {
    document.getElementById('userName').value = '';
    document.getElementById('emailRegister').value = '';
    document.getElementById('passwordRegister').value = '';

    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (registerModal) {
        registerModal.hide();
    }
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    toggleModalEffects(true);
};
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
    settingsBtn.addEventListener('click', async () => {
        const ok = await profile();
        if (ok) window.location.href = 'settings.html';
    });
}

function backToDashboard() {
    window.location.href = 'index.html';
    closeAllModals()
}

function logout() {
    const email = localStorage.getItem('currentUserEmail');
    if (email) {
        localStorage.removeItem(`profilePic_${email}`);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('currentUserEmail');
    window.location.href = 'index.html';
}