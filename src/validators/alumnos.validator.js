function validateCreateAlumno(body) {
    const { nombres, apellidos, matricula, promedio, password } = body;

    if (!nombres || !apellidos || !matricula || promedio === undefined || !password) {
        return { status: 400, body: { error: "Campos incompletos" } };
    }

    if (
        typeof promedio !== "number" ||
        typeof password !== "string" ||
        (body.fotoPerfilUrl !== undefined && body.fotoPerfilUrl !== null && typeof body.fotoPerfilUrl !== "string")
    ) {
        return { status: 400, body: { error: "Campos inv\u00e1lidos" } };
    }

    return null;
}

function validateUpdateAlumno(body, id) {
    const camposValidos = ['id', 'nombres', 'apellidos', 'matricula', 'promedio', 'password', 'fotoPerfilUrl'];
    const keys = Object.keys(body);

    if (keys.length === 0) {
        return { status: 400, body: { error: "Body vac\u00edo" } };
    }

    for (let key of keys) {
        if (!camposValidos.includes(key)) {
            return { status: 400, body: { error: "Campo inv\u00e1lido" } };
        }
    }

    if (body.id !== undefined && body.id !== Number(id)) {
        return { status: 400, body: { error: "Campos inv\u00e1lidos" } };
    }

    if (
        (body.id !== undefined && typeof body.id !== "number") ||
        (body.nombres !== undefined && typeof body.nombres !== "string") ||
        (body.apellidos !== undefined && typeof body.apellidos !== "string") ||
        (body.matricula !== undefined && typeof body.matricula !== "string") ||
        (body.promedio !== undefined && typeof body.promedio !== "number") ||
        (body.password !== undefined && typeof body.password !== "string") ||
        (body.fotoPerfilUrl !== undefined && body.fotoPerfilUrl !== null && typeof body.fotoPerfilUrl !== "string")
    ) {
        return { status: 400, body: { error: "Tipos inv\u00e1lidos" } };
    }

    return null;
}

module.exports = {
    validateCreateAlumno,
    validateUpdateAlumno,
};
