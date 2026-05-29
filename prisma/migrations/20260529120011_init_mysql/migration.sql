-- CreateTable
CREATE TABLE `Alumno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `promedio` DOUBLE NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fotoPerfilUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Alumno_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profesor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroEmpleado` VARCHAR(191) NOT NULL,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `horasClase` INTEGER NOT NULL,

    UNIQUE INDEX `Profesor_numeroEmpleado_key`(`numeroEmpleado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
