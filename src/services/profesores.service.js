const profesoresRepository = require('../repositories/profesores.repository');

function parseId(value) {
    const id = Number(value);

    return Number.isNaN(id) ? null : id;
}

function toCreateData(data) {
    return {
        numeroEmpleado: String(data.numeroEmpleado),
        nombres: data.nombres,
        apellidos: data.apellidos,
        horasClase: data.horasClase,
    };
}

function toUpdateData(data) {
    const updateData = { ...data };

    delete updateData.id;

    if (updateData.numeroEmpleado !== undefined) {
        updateData.numeroEmpleado = String(updateData.numeroEmpleado);
    }

    return updateData;
}

function getAllProfesores() {
    return profesoresRepository.findAll();
}

function findProfesorById(id) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return null;
    }

    return profesoresRepository.findById(parsedId);
}

function createProfesor(profesor) {
    return profesoresRepository.create(toCreateData(profesor));
}

async function updateProfesor(id, data) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return null;
    }

    const profesor = await profesoresRepository.findById(parsedId);

    if (!profesor) {
        return null;
    }

    return profesoresRepository.update(parsedId, toUpdateData(data));
}

async function deleteProfesor(id) {
    const parsedId = parseId(id);

    if (parsedId === null) {
        return false;
    }

    const profesor = await profesoresRepository.findById(parsedId);

    if (!profesor) {
        return false;
    }

    await profesoresRepository.remove(parsedId);

    return true;
}

module.exports = {
    getAllProfesores,
    findProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesor,
};
