const express = require('express');
const app = express();

app.use(express.json());

let alumnos = [];
let profesores = [];

/* =========================
   ALUMNOS
========================= */

// GET todos
app.get('/alumnos', (req, res) => {
    res.status(200).json(alumnos);
});

// GET por id
app.get('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id == req.params.id);

    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }

    res.status(200).json(alumno);
});

// POST
app.post('/alumnos', (req, res) => {
    const { id, nombres, apellidos, matricula, promedio } = req.body;

    if (
        id === undefined ||
        !nombres ||
        !apellidos ||
        !matricula ||
        promedio === undefined
    ) {
        return res.status(400).json({ error: "Campos incompletos" });
    }

    if (
        typeof id !== "number" ||
        typeof nombres !== "string" ||
        typeof apellidos !== "string" ||
        typeof matricula !== "string" ||
        typeof promedio !== "number"
    ) {
        return res.status(400).json({ error: "Tipos inválidos" });
    }

    alumnos.push(req.body);

    res.status(201).json(req.body);
});

// PUT
app.put('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id == req.params.id);

    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }

    const { nombres, apellidos, matricula, promedio } = req.body;

    if (
        (nombres !== undefined && nombres === "") ||
        (apellidos !== undefined && apellidos === "") ||
        (matricula !== undefined && matricula === "") ||
        (promedio !== undefined && typeof promedio !== "number")
    ) {
        return res.status(400).json({ error: "Campos inválidos" });
    }

    Object.assign(alumno, req.body);

    res.status(200).json(alumno);
});

// DELETE
app.delete('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id == req.params.id);

    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }

    alumnos = alumnos.filter(a => a.id != req.params.id);

    res.status(200).json({ mensaje: "Eliminado" });
});

/* =========================
   PROFESORES
========================= */

// GET todos
app.get('/profesores', (req, res) => {
    res.status(200).json(profesores);
});

// GET por id
app.get('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id == req.params.id);

    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }

    res.status(200).json(profesor);
});

// POST
app.post('/profesores', (req, res) => {
    const { id, numeroEmpleado, nombres, apellidos, horasClase } = req.body;

    if (
        id === undefined ||
        !numeroEmpleado ||
        !nombres ||
        !apellidos ||
        horasClase === undefined
    ) {
        return res.status(400).json({ error: "Campos incompletos" });
    }

    if (
        typeof id !== "number" ||
        typeof numeroEmpleado !== "string" ||
        typeof nombres !== "string" ||
        typeof apellidos !== "string" ||
        typeof horasClase !== "number"
    ) {
        return res.status(400).json({ error: "Tipos inválidos" });
    }

    profesores.push(req.body);

    res.status(201).json(req.body);
});

// PUT
app.put('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id == req.params.id);

    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }

    const { numeroEmpleado, nombres, apellidos, horasClase } = req.body;

    if (
        (numeroEmpleado !== undefined && numeroEmpleado === "") ||
        (nombres !== undefined && nombres === "") ||
        (apellidos !== undefined && apellidos === "") ||
        (horasClase !== undefined && typeof horasClase !== "number")
    ) {
        return res.status(400).json({ error: "Campos inválidos" });
    }

    Object.assign(profesor, req.body);

    res.status(200).json(profesor);
});

// DELETE
app.delete('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id == req.params.id);

    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }

    profesores = profesores.filter(p => p.id != req.params.id);

    res.status(200).json({ mensaje: "Eliminado" });
});

/* =========================
   MÉTODOS NO PERMITIDOS
========================= */

app.all('/alumnos', (req, res, next) => {
    if (req.method === 'GET' || req.method === 'POST') return next();
    res.status(405).json({ error: "Método no permitido" });
});

app.all('/profesores', (req, res, next) => {
    if (req.method === 'GET' || req.method === 'POST') return next();
    res.status(405).json({ error: "Método no permitido" });
});

/* ========================= */

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor corriendo en puerto 3000");
});