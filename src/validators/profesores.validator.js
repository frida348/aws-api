function validateCreateProfesor(body) {
    const { numeroEmpleado, nombres, apellidos, horasClase } = body;

    if (numeroEmpleado === undefined || !nombres || !apellidos || horasClase === undefined) {
        return { status: 400, body: { error: "Campos incompletos" } };
    }

    if (
        (typeof numeroEmpleado !== "number" && typeof numeroEmpleado !== "string") ||
        typeof horasClase !== "number"
    ) {
        return { status: 400, body: { error: "Campos inv\u00e1lidos" } };
    }

    return null;
}

function validateUpdateProfesor(body, id) {
    const camposValidos = ['id', 'numeroEmpleado', 'nombres', 'apellidos', 'horasClase'];
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

    const { numeroEmpleado, nombres, apellidos, horasClase } = body;

    if (
        (numeroEmpleado !== undefined && (
            numeroEmpleado === "" ||
            numeroEmpleado === null ||
            (typeof numeroEmpleado !== "number" && typeof numeroEmpleado !== "string") ||
            (typeof numeroEmpleado === "number" && numeroEmpleado < 0)
        )) ||
        (nombres !== undefined && (nombres === "" || nombres === null)) ||
        (apellidos !== undefined && (apellidos === "" || apellidos === null)) ||
        (horasClase !== undefined && (typeof horasClase !== "number" || horasClase < 0))
    ) {
        return { status: 400, body: { error: "Campos inv\u00e1lidos" } };
    }

    return null;
}

module.exports = {
    validateCreateProfesor,
    validateUpdateProfesor,
};
