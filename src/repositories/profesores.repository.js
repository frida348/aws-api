const prisma = require('../lib/prisma');

function findAll() {
    return prisma.profesor.findMany({
        orderBy: {
            id: 'asc',
        },
    });
}

function findById(id) {
    return prisma.profesor.findUnique({
        where: {
            id,
        },
    });
}

function create(data) {
    return prisma.profesor.create({
        data,
    });
}

function update(id, data) {
    return prisma.profesor.update({
        where: {
            id,
        },
        data,
    });
}

function remove(id) {
    return prisma.profesor.delete({
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
