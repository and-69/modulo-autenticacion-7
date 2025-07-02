import Register from '../models/register.js';
import bcrypt from 'bcryptjs';
const usersHelpers = {
    validarUsuario: async (email) => {
        const usuario= await Register.findOne({email});
        if (!usuario) {
            return {
                status: 400,
                msg: "Usuario no encontrado"
            };
        }
        if (usuario.estado === 0) {
            return {
                status: 400,
                msg: "Usuario inactivo"
            };
        }
        return { status: 200, msg: "Usuario válido" };
    },
    validarEmail: async (email, { req }) => {
        const usuario = await Register.findOne({ email });
        if (usuario) {
            throw new Error('Email ya está en uso');
        }
        return true;
    },
    validarPassword: async (password,{req}) => {
        const {email}=req.body;
        const holder = await Register.findOne({ email });
        if (!holder) {
            throw new Error('Usuario no encontrado');
        }
        const isValid = bcrypt.compareSync(password, holder.password);
        if (!isValid) {
            throw new Error('Contraseña incorrecta');
        }
        return true;
    }
}
export { usersHelpers };