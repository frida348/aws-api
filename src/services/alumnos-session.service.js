const crypto = require('crypto');
const alumnosService = require('./alumnos.service');
const dynamodbService = require('../integrations/aws/dynamodb.service');

function parseId(value) {
    const id = Number(value);

    return Number.isNaN(id) ? null : id;
}

function generateSessionString() {
    return crypto.randomBytes(96).toString('base64url').slice(0, 128);
}

async function login(id, password) {
    const alumno = await alumnosService.findAlumnoById(id);

    if (!alumno || alumno.password !== password) {
        return null;
    }

    const session = {
        id: crypto.randomUUID(),
        fecha: new Date().toISOString(),
        sessionString: generateSessionString(),
        alumnoId: alumno.id,
        active: true,
    };

    await dynamodbService.saveSession(session);

    return {
        sessionString: session.sessionString,
    };
}

async function verify(id, sessionString) {
    if (!sessionString) {
        return false;
    }

    const parsedId = parseId(id);

    if (parsedId === null) {
        return false;
    }

    const session = await dynamodbService.findSession(sessionString);

    return Boolean(session && session.active === true && session.alumnoId === parsedId);
}

async function logout(id, sessionString) {
    if (!sessionString) {
        return false;
    }

    const parsedId = parseId(id);

    if (parsedId === null) {
        return false;
    }

    const session = await dynamodbService.findSession(sessionString);

    if (!session || session.active !== true || session.alumnoId !== parsedId) {
        return false;
    }

    await dynamodbService.deactivateSession(sessionString);

    return true;
}

module.exports = {
    login,
    verify,
    logout,
};
