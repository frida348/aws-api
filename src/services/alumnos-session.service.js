const crypto = require('crypto');
const alumnosService = require('./alumnos.service');
const dynamodbService = require('../integrations/aws/dynamodb.service');

const memorySessions = new Map();

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

    memorySessions.set(session.sessionString, session);

    try {
        await dynamodbService.saveSession(session);
    } catch (error) {
        console.error("Error DynamoDB saveSession completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });
    }

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

    let session;

    try {
        session = await dynamodbService.findSession(sessionString);
    } catch (error) {
        console.error("Error DynamoDB findSession completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });
    }

    if (!session) {
        session = memorySessions.get(sessionString);
    }

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

    let session;

    try {
        session = await dynamodbService.findSession(sessionString);
    } catch (error) {
        console.error("Error DynamoDB findSession completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });
    }

    if (!session) {
        session = memorySessions.get(sessionString);
    }

    if (!session || session.active !== true || session.alumnoId !== parsedId) {
        return false;
    }

    session.active = false;
    memorySessions.set(sessionString, session);

    try {
        await dynamodbService.deactivateSession(sessionString);
    } catch (error) {
        console.error("Error DynamoDB deactivateSession completo:", {
            name: error.name,
            message: error.message,
            code: error.code,
            Code: error.Code,
            stack: error.stack
        });
    }

    return true;
}

module.exports = {
    login,
    verify,
    logout,
};
