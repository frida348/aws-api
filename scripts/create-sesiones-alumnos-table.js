const dynamodbService = require('../src/integrations/aws/dynamodb.service');

async function main() {
    const result = await dynamodbService.createSessionsTable();

    if (result.created) {
        console.log(`Tabla creada: ${result.tableName}`);
        return;
    }

    console.log(`La tabla ya existe: ${result.tableName}`);
}

main().catch((error) => {
    console.error('Error al crear la tabla sesiones-alumnos:', {
        name: error.name,
        message: error.message,
        code: error.code,
        Code: error.Code,
        stack: error.stack,
    });
    process.exit(1);
});
