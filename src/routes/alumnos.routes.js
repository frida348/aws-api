const express = require('express');
const alumnosController = require('../controllers/alumnos.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router
    .route('/')
    .get(alumnosController.getAllAlumnos)
    .post(alumnosController.createAlumno)
    .all(alumnosController.methodNotAllowedCollection);

router.post('/:id/fotoPerfil', upload.any(), alumnosController.uploadFotoPerfil);
router.all('/:id/fotoPerfil', alumnosController.methodNotAllowedFotoPerfil);

router.post('/:id/session/login', alumnosController.loginSession);
router.all('/:id/session/login', alumnosController.methodNotAllowedSession);

router.post('/:id/session/verify', alumnosController.verifySession);
router.all('/:id/session/verify', alumnosController.methodNotAllowedSession);

router.post('/:id/session/logout', alumnosController.logoutSession);
router.all('/:id/session/logout', alumnosController.methodNotAllowedSession);

router.post('/:id/email', alumnosController.sendAlumnoEmail);
router.all('/:id/email', alumnosController.methodNotAllowedEmail);

router
    .route('/:id')
    .get(alumnosController.getAlumnoById)
    .put(alumnosController.updateAlumno)
    .delete(alumnosController.deleteAlumno)
    .all(alumnosController.methodNotAllowedResource);

module.exports = router;
