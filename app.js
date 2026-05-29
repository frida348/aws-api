const app = require('./src/app');

module.exports = app;

if (require.main === module) {
    app.listen(3000, '0.0.0.0', () => {
        console.log("Servidor corriendo en puerto 3000");
    });
}
