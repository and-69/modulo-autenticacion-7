import Register from "../models/register.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../middlewares/jwt.js";

const auth = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const holder = await Register.findOne({ email });
            const token = await generarJWT(holder._id);
            res.header('Authorization', token);
            res.json({
                holder: {
                    _id: holder._id,
                    username: holder.username,
                    email: holder.email,
                },
                token,
                msg: "Holder logueado correctamente",
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Hable con el WebMaster"
            })
        }
    },
    register: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const holder = new Register({ username, email, password });
            const salt = bcryptjs.genSaltSync();
            holder.password = bcryptjs.hashSync(password, salt);
            await holder.save();

            res.status(201).json({
                holder: {
                    _id: holder._id,
                    username: holder.username,
                    email: holder.email,
                },
                msg: "Holder registrado correctamente",
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Hable con el WebMaster",
                error: error.message
            })
        }
    },
    profile: async (req, res) => {
        try {
            const holder = req.usuario;
            if (!holder) throw new Error('Usuario no encontrado');

            const { username, email, password } = req.body;
            let updated = false;

            if (username && username !== holder.username) {
                const exists = await Register.findOne({ username, _id: { $ne: holder._id } });
                if (exists) throw new Error('El nombre de usuario ya está en uso');
                holder.username = username;
                updated = true;
            }

            if (email && email !== holder.email) {
                const exists = await Register.findOne({ email, _id: { $ne: holder._id } });
                if (exists) throw new Error('El correo electrónico ya está en uso');
                holder.email = email;
                updated = true;
            }

            if (password) {
                const salt = bcryptjs.genSaltSync();
                holder.password = bcryptjs.hashSync(password, salt);
                updated = true;
            }

            if (updated) {
                await holder.save();
                res.json({
                    holder: {
                        _id: holder._id,
                        username: holder.username,
                        email: holder.email,
                    },
                    msg: "Perfil actualizado correctamente"
                });
            } else {
                res.json({
                    holder: {
                        _id: holder._id,
                        username: holder.username,
                        email: holder.email,
                    },
                    msg: "No se realizaron cambios en el perfil"
                });
            }
        } catch (error) {
            res.status(400).json({
                msg: error.message || "Error al actualizar el perfil"
            });
        }
    }
}

export { auth };