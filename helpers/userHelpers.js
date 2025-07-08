import Register from '../models/register.js';
import bcrypt from 'bcryptjs';
const usersHelpers = {
    validarUsuario: async (email) => {
        const usuario = await Register.findOne({ email });
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }
        if (usuario.estado === 0) {
            throw new Error('Usuario inactivo')
        }
        return true;
    },
    validarEmail: async (email, { req }) => {
        const usuario = await Register.findOne({ email });
        if (usuario) {
            throw new Error('Email ya está en uso');
        }
        return true;
    },
    validarPassword: async (password, { req }) => {
        const { email } = req.body;
        const holder = await Register.findOne({ email });
        if (!holder) {
            throw new Error('Usuario no encontrado');
        }
        const isValid = bcrypt.compareSync(password, holder.password);
        if (!isValid) {
            throw new Error('Contraseña incorrecta');
        }
        return true;
    },
    validarUsername: async (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!usernameRegex.test(username)) {
            throw new Error('El nombre de usuario solo puede contener letras, números y guiones bajos, mínimo 3 caracteres.');
        }
        const usuario = await Register.findOne({ username });
        if (usuario) {
            throw new Error('El nombre de usuario ya está en uso');
        }
        return true;
    },

}
export { usersHelpers };