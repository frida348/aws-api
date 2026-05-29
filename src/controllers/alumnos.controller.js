const alumnosService = require('../services/alumnos.service');
const alumnosSessionService = require('../services/alumnos-session.service');
const alumnosValidator = require('../validators/alumnos.validator');

function handleWriteError(res) {
    return res.status(400).json({ error: "Campos inv\u00e1lidos" });
}

async function getAllAlumnos(req, res) {
    const alumnos = await alumnosService.getAllAlumnos();

    return res.status(200).json(alumnos);
}

async function getAlumnoById(req, res) {
    const alumno = await alumnosService.findAlumnoById(req.params.id);

    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }

    return res.status(200).json(alumno);
}

async function createAlumno(req, res) {
    const validationError = alumnosValidator.validateCreateAlumno(req.body);

    if (validationError) {
        return res.status(validationError.status).json(validationError.body);
    }

    try {
        const alumno = await alumnosService.createAlumno(req.body);

        return res.status(201).json(alumno);
    } catch (error) {
        return handleWriteError(res);
    }
}

async function updateAlumno(req, res) {
    const validationError = alumnosValidator.validateUpdateAlumno(req.body, req.params.id);

    if (validationError) {
        return res.status(validationError.status).json(validationError.body);
    }

    try {
        const alumno = await alumnosService.updateAlumno(req.params.id, req.body);

        if (!alumno) {
            return res.status(404).json({ error: "No encontrado" });
        }

        return res.status(200).json(alumno);
    } catch (error) {
        return handleWriteError(res);
    }
}

async function deleteAlumno(req, res) {
    const deleted = await alumnosService.deleteAlumno(req.params.id);

    if (!deleted) {
        return res.status(404).json({ error: "No encontrado" });
    }

    return res.status(200).json({ mensaje: "Eliminado" });
}

async function uploadFotoPerfil(req, res) {
    const file = req.file || (req.files || []).find(item => item.fieldname === 'fotoPerfil' || item.fieldname === 'foto');

    if (!file) {
        return res.status(400).json({ error: "Archivo requerido" });
    }

    try {
        const alumno = await alumnosService.updateFotoPerfil(req.params.id, file);

        if (!alumno) {
            return res.status(404).json({ error: "No encontrado" });
        }

        return res.status(200).json(alumno);
    } catch (error) {
        console.error("Error S3 completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });

        return res.status(400).json({ error: "Error al subir archivo" });
    }
}

async function loginSession(req, res) {
    try {
        const session = await alumnosSessionService.login(req.params.id, req.body.password);

        if (!session) {
            return res.status(400).json({ error: "Campos inv\u00e1lidos" });
        }

        return res.status(200).json(session);
    } catch (error) {
        return res.status(400).json({ error: "Campos inv\u00e1lidos" });
    }
}

async function verifySession(req, res) {
    try {
        const valid = await alumnosSessionService.verify(req.params.id, req.body.sessionString);

        if (!valid) {
            return res.status(400).json({ error: "Campos inv\u00e1lidos" });
        }

        return res.status(200).json({ active: true });
    } catch (error) {
        return res.status(400).json({ error: "Campos inv\u00e1lidos" });
    }
}

async function logoutSession(req, res) {
    try {
        const closed = await alumnosSessionService.logout(req.params.id, req.body.sessionString);

        if (!closed) {
            return res.status(400).json({ error: "Campos inv\u00e1lidos" });
        }

        return res.status(200).json({ mensaje: "Sesion cerrada" });
    } catch (error) {
        return res.status(400).json({ error: "Campos inv\u00e1lidos" });
    }
}

async function sendAlumnoEmail(req, res) {
    try {
        const alumno = await alumnosService.sendAlumnoEmail(req.params.id);

        if (!alumno) {
            return res.status(404).json({ error: "No encontrado" });
        }

        return res.status(200).json({ mensaje: "Mensaje enviado" });
    } catch (error) {
        return res.status(400).json({ error: "Campos inv\u00e1lidos" });
    }
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

function methodNotAllowedFotoPerfil(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "M\u00e9todo no permitido" });
    }
}

function methodNotAllowedSession(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "M\u00e9todo no permitido" });
    }
}

function methodNotAllowedEmail(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "M\u00e9todo no permitido" });
    }
}

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    uploadFotoPerfil,
    loginSession,
    verifySession,
    logoutSession,
    sendAlumnoEmail,
    methodNotAllowedCollection,
    methodNotAllowedResource,
    methodNotAllowedFotoPerfil,
    methodNotAllowedSession,
    methodNotAllowedEmail,
};
