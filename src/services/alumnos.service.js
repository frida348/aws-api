const alumnosRepository = require('../repositories/alumnos.repository');
const s3Service = require('../integrations/aws/s3.service');
const snsService = require('../integrations/aws/sns.service');

function parseId(value) {
    const id = Number(value);

    return Number.isNaN(id) ? null : id;
}

function toCreateData(data) {
    return {
        nombres: data.nombres,
        apellidos: data.apellidos,
        matricula: data.matricula,
        promedio: data.promedio,
        password: data.password,
        fotoPerfilUrl: data.fotoPerfilUrl ?? null,
    };
}

function toUpdateData(data) {
    const updateData = { ...data };

    delete updateData.id;

    return updateData;
}

function getAllAlumnos() {
    return alumnosRepository.findAll();
}

function findAlumnoById(id) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return null;
    }

    return alumnosRepository.findById(parsedId);
}

function createAlumno(alumno) {
    return alumnosRepository.create(toCreateData(alumno));
}

async function updateAlumno(id, data) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return null;
    }

    const alumno = await alumnosRepository.findById(parsedId);

    if (!alumno) {
        return null;
    }

    return alumnosRepository.update(parsedId, toUpdateData(data));
}

async function deleteAlumno(id) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return false;
    }

    const alumno = await alumnosRepository.findById(parsedId);

    if (!alumno) {
        return false;
    }

    await alumnosRepository.remove(parsedId);

    return true;
}

async function updateFotoPerfil(id, file) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return null;
    }

    const alumno = await alumnosRepository.findById(parsedId);

    if (!alumno) {
        return null;
    }

    const fotoPerfilUrl = await s3Service.uploadProfilePhoto(parsedId, file);

    return alumnosRepository.update(parsedId, {
        fotoPerfilUrl,
    });
}

function buildAlumnoEmailMessage(alumno) {
    return [
        `Nombre: ${alumno.nombres}`,
        `Apellidos: ${alumno.apellidos}`,
        `Matricula: ${alumno.matricula}`,
        `Promedio: ${alumno.promedio}`,
        `fotoPerfilUrl: ${alumno.fotoPerfilUrl || ''}`,
    ].join('\n');
}

async function sendAlumnoEmail(id) {
    const alumno = await findAlumnoById(id);

    if (!alumno) {
        return null;
    }

    try {
        await snsService.publishAlumnoEmail(buildAlumnoEmailMessage(alumno));
    } catch (error) {
        console.error("Error SNS publish completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });
    }

    return alumno;
}

module.exports = {
    getAllAlumnos,
    findAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    updateFotoPerfil,
    sendAlumnoEmail,
};
