import { Router } from "express";
import { auth } from '../controllers/auth.js';
import { validarCampos } from "../middlewares/validarCampos.js";
import { usersHelpers } from "../helpers/userHelpers.js";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/jwt.js";

const router = new Router;

router.post('/login', [
    check('email').custom(usersHelpers.validarUsuario),
    check('password').custom(usersHelpers.validarPassword),
    validarCampos
], auth.login)

router.post('/register', [
    check('username').custom(usersHelpers.validarUsername),
    check('email').isEmail().withMessage('El email debe ser válido.'),
    check('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'),
    validarCampos
], auth.register)

router.post('/profile', [
    validarJWT,

    validarCampos
],
    auth.profile
)
router.post('/profile/edit', [
    validarJWT,
    check('username').optional().custom(usersHelpers.validarUsername),
    check('email').optional().custom(usersHelpers.validarEmail),
    check('password').optional().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'),
    validarCampos
], auth.profile)

export default router;