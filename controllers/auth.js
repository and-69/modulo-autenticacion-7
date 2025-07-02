import Register from "../models/register.js";
import login from "../models/login.js";
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
                    token: token
                },
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

    dashboard: async (req, res) => {
        try {
            const { token } = req.header('Authorization');
            const { email, password } = req.body;
            const usuario = await Users.findOne({ email })

            res.json({
                usuario,
                token
            })
        } catch (error) {
            return res.status(500).json({
                msg: "Hable con el WebMaster"
            })
        }
    }
}

export { auth };