const express = require('express');
const app = express();

app.use(express.json());


let alumnos = [];
let profesores = [];

// alumnos

app.get('/alumnos', (req, res) => {
    res.status(200).json(alumnos);
});

app.get('/alumnos/:id', (req, res) => {
    const alumno = alumnos.find(a => a.id == req.params.id);
    if (!alumno) return res.status(404).json({error: "No encontrado"});
    res.json(alumno);
});

app.post('/alumnos', (req, res) => {
    const {id, nombres, apellidos, matricula, promedio} = req.body;

    if (!id || !nombres || !apellidos || !matricula || !promedio) {
        return res.status(400).json({error: "Campos incompletos"});
    }

    alumnos.push(req.body);
    res.status(201).json(req.body);
});


app.put('/alumnos/:id', (req, res) => {
    let alumno = alumnos.find(a => a.id == req.params.id);
    if (!alumno) return res.status(404).json({error: "No encontrado"});

    Object.assign(alumno, req.body);
    res.json(alumno);
});


app.delete('/alumnos/:id', (req, res) => {
    alumnos = alumnos.filter(a => a.id != req.params.id);
    res.json({mensaje: "Eliminado"});
});

//profesores
app.get('/profesores', (req, res) => {
    res.status(200).json(profesores);
});


app.get('/profesores/:id', (req, res) => {
    const profesor = profesores.find(p => p.id == req.params.id);
    if (!profesor) return res.status(404).json({error: "No encontrado"});
    res.json(profesor);
});


app.post('/profesores', (req, res) => {
    const {id, numeroEmpleado, nombres, apellidos, horasClase} = req.body;

    if (!id || !numeroEmpleado || !nombres || !apellidos || !horasClase) {
        return res.status(400).json({error: "Campos incompletos"});
    }

    profesores.push(req.body);
    res.status(201).json(req.body);
});


app.put('/profesores/:id', (req, res) => {
    let profesor = profesores.find(p => p.id == req.params.id);
    if (!profesor) return res.status(404).json({error: "No encontrado"});

    Object.assign(profesor, req.body);
    res.json(profesor);
});


app.delete('/profesores/:id', (req, res) => {
    const existe = profesores.find(p => p.id == req.params.id);
    if (!existe) return res.status(404).json({error: "No encontrado"});

    profesores = profesores.filter(p => p.id != req.params.id);
    res.json({mensaje: "Eliminado"});
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
