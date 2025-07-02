import { Router } from "express";
import {auth} from '../controllers/auth.js';
import { validarCampos } from "../middlewares/validarCampos.js";
import { usersHelpers } from "../helpers/userHelpers.js";
import { check } from "express-validator";

const router = new Router;

router.post('/login',[
    check('email').custom(usersHelpers.validarUsuario),
    check('password').custom(usersHelpers.validarPassword),
    validarCampos
],auth.login)

router.post('/register',auth.register)


export default router;