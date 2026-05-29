const express = require('express');
const profesoresController = require('../controllers/profesores.controller');

const router = express.Router();

router
    .route('/')
    .get(profesoresController.getAllProfesores)
    .post(profesoresController.createProfesor)
    .all(profesoresController.methodNotAllowedCollection);

router
    .route('/:id')
    .get(profesoresController.getProfesorById)
    .put(profesoresController.updateProfesor)
    .delete(profesoresController.deleteProfesor)
    .all(profesoresController.methodNotAllowedResource);

module.exports = router;
