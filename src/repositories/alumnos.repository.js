const prisma = require('../lib/prisma');

function findAll() {
    return prisma.alumno.findMany({
        orderBy: {
            id: 'asc',
        },
    });
}

function findById(id) {
    return prisma.alumno.findUnique({
        where: {
            id,
        },
    });
}

function create(data) {
    return prisma.alumno.create({
        data,
    });
}

function update(id, data) {
    return prisma.alumno.update({
        where: {
            id,
        },
        data,
    });
}

function remove(id) {
    return prisma.alumno.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
