const profesoresService = require('../services/profesores.service');
const profesoresValidator = require('../validators/profesores.validator');

function handleWriteError(res) {
    return res.status(400).json({ error: "Campos inv\u00e1lidos" });
}

async function getAllProfesores(req, res) {
    const profesores = await profesoresService.getAllProfesores();

    return res.status(200).json(profesores);
}

async function getProfesorById(req, res) {
    const profesor = await profesoresService.findProfesorById(req.params.id);

    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }

    return res.status(200).json(profesor);
}

async function createProfesor(req, res) {
    const validationError = profesoresValidator.validateCreateProfesor(req.body);

    if (validationError) {
        return res.status(validationError.status).json(validationError.body);
    }

    try {
        const profesor = await profesoresService.createProfesor(req.body);

        return res.status(201).json(profesor);
    } catch (error) {
        return handleWriteError(res);
    }
}

async function updateProfesor(req, res) {
    const validationError = profesoresValidator.validateUpdateProfesor(req.body, req.params.id);

    if (validationError) {
        return res.status(validationError.status).json(validationError.body);
    }

    try {
        const profesor = await profesoresService.updateProfesor(req.params.id, req.body);

        if (!profesor) {
            return res.status(404).json({ error: "No encontrado" });
        }

        return res.status(200).json(profesor);
    } catch (error) {
        return handleWriteError(res);
    }
}

async function deleteProfesor(req, res) {
    const deleted = await profesoresService.deleteProfesor(req.params.id);

    if (!deleted) {
        return res.status(404).json({ error: "No encontrado" });
    }

    return res.status(200).json({ mensaje: "Eliminado" });
}

function methodNotAllowedCollection(req, res) {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405).json({ error: "M\u00e9todo no permitido" });
    }
}

function methodNotAllowedResource(req, res) {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ error: "M\u00e9todo no permitido" });
    }
}

module.exports = {
    getAllProfesores,
    getProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    methodNotAllowedCollection,
    methodNotAllowedResource,
};
