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
    return res.status(200).json(alumnos);
});
 
// GET por id
app.get('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id === Number(req.params.id));
 
    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }
 
    return res.status(200).json(alumno);
});
 
// POST
app.post('/alumnos', (req, res) => {
    const { id, nombres, apellidos, matricula, promedio } = req.body;
 
    if (id === undefined || !nombres || !apellidos || !matricula || promedio === undefined) {
        return res.status(400).json({ error: "Campos incompletos" });
    }
 
    if (typeof promedio !== "number") {
        return res.status(400).json({ error: "Campos inválidos" });
    }
 
    alumnos.push(req.body);
 
    return res.status(201).json(req.body);
});
 
// PUT
app.put('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id == req.params.id);

    if (!alumno) {
        return res.status(404).json({ error: "No encontrado" });
    }

    const camposValidos = ['id', 'nombres', 'apellidos', 'matricula', 'promedio'];
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        return res.status(400).json({ error: "Body vacío" });
    }

    for (let key of keys) {
        if (!camposValidos.includes(key)) {
            return res.status(400).json({ error: "Campo inválido" });
        }
    }

    if (
        (req.body.id !== undefined && typeof req.body.id !== "number") ||
        (req.body.nombres !== undefined && typeof req.body.nombres !== "string") ||
        (req.body.apellidos !== undefined && typeof req.body.apellidos !== "string") ||
        (req.body.matricula !== undefined && typeof req.body.matricula !== "string") ||
        (req.body.promedio !== undefined && typeof req.body.promedio !== "number")
    ) {
        return res.status(400).json({ error: "Tipos inválidos" });
    }

    Object.assign(alumno, req.body);

    res.status(200).json(alumno);
});
// DELETE
app.delete('/alumnos/:id', (req, res) => {
    const index = alumnos.findIndex(a => a.id === Number(req.params.id));
 
    if (index === -1) {
        return res.status(404).json({ error: "No encontrado" });
    }
 
    alumnos.splice(index, 1);
 
    return res.status(200).json({ mensaje: "Eliminado" });
});
 
/* =========================
   PROFESORES
========================= */
 
// GET todos
app.get('/profesores', (req, res) => {
    return res.status(200).json(profesores);
});
 
// GET por id
app.get('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id === Number(req.params.id));
 
    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }
 
    return res.status(200).json(profesor);
});
 
// POST
app.post('/profesores', (req, res) => {
    const { id, numeroEmpleado, nombres, apellidos, horasClase } = req.body;
 
    if (id === undefined || numeroEmpleado === undefined || !nombres || !apellidos || horasClase === undefined) {
        return res.status(400).json({ error: "Campos incompletos" });
    }
 
    // 🔥 SOLO validar horasClase
    if (typeof horasClase !== "number") {
        return res.status(400).json({ error: "Campos inválidos" });
    }
 
    profesores.push(req.body);
 
    return res.status(201).json(req.body);
});
 
// PUT
app.put('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id == req.params.id);

    if (!profesor) {
        return res.status(404).json({ error: "No encontrado" });
    }

    const camposValidos = ['id', 'numeroEmpleado', 'nombres', 'apellidos', 'horasClase'];
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        return res.status(400).json({ error: "Body vacío" });
    }

    for (let key of keys) {
        if (!camposValidos.includes(key)) {
            return res.status(400).json({ error: "Campo inválido" });
        }
    }

    if (
        (req.body.horasClase !== undefined && isNaN(req.body.horasClase)) ||
        (req.body.nombres !== undefined && req.body.nombres === "") ||
        (req.body.apellidos !== undefined && req.body.apellidos === "") ||
        (req.body.numeroEmpleado !== undefined && req.body.numeroEmpleado === "")
    ) {
        return res.status(400).json({ error: "Campos inválidos" });
    }

    Object.assign(profesor, req.body);

    res.status(200).json(profesor);
});
 
// DELETE
app.delete('/profesores/:id', (req, res) => {
    const index = profesores.findIndex(p => p.id === Number(req.params.id));
 
    if (index === -1) {
        return res.status(404).json({ error: "No encontrado" });
    }
 
    profesores.splice(index, 1);
 
    return res.status(200).json({ mensaje: "Eliminado" });
});
 
/* =========================
   405
========================= */
 
app.all('/alumnos', (req, res) => {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido" });
    }
});
 
app.all('/alumnos/:id', (req, res) => {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido" });
    }
});
 
app.all('/profesores', (req, res) => {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido" });
    }
});
 
app.all('/profesores/:id', (req, res) => {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido" });
    }
});
 
/* =========================
   EXPORT
========================= */
module.exports = app;
 
if (require.main === module) {
    app.listen(3000, '0.0.0.0', () => {
        console.log("Servidor corriendo en puerto 3000");
    });
}