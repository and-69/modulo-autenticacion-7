import 'dotenv/config'
import jwt from 'jsonwebtoken'
import Users from '../models/register.js'

const generarJWT = (_id) => {
    return new Promise((resolve, reject) => {
        const payload = { _id }
        jwt.sign(payload, process.env.JWT_PD, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validarJWT = async (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion",
        })
    }
    try {
        const { _id } = jwt.verify(token, process.env.JWT_PD)
        const usuario = await Users.findById(_id);
        if (!usuario || usuario.estado == 0) {
            return res.status(401).json({
                msg: "Token no válido - Usuario inexistente o inactivo"
            })
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({
            msg: "Token no valido",
            error: error.message
        })
    }
}

export { generarJWT, validarJWT }