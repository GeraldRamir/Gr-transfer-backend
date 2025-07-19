import mongoose from "mongoose";
import colors  from "colors";
// Importar dotenv para manejar variables de entorno


const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI); // 👈 Opciones eliminadas

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(colors.magenta.bold(`Conectado a la base de datos en: ${url}`));

    } catch (error) {
        console.log(colors.red.bold(`Error: ${error.message}`));
        process.exit(1);
    }
};

export default conectarDB;
