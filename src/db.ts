import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

dotenv.config();

const {
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	CA_PEM
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
	throw new Error('Faltan variables de entorno de la BD en .env');
}

let ca: string | Buffer | undefined;

if (CA_PEM) {
	ca = CA_PEM;
	console.log('Certificado CA cargado desde variable de entorno');
} else {
	try {
		ca = fs.readFileSync(path.join(process.cwd(), 'ca.pem'));
		console.log('Certificado CA cargado correctamente desde archivo');
	} catch (err) {
		console.warn('ca.pem no encontrado. Intentando conectar sin certificado custom...', err);
	}
}

const pool = mysql.createPool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false }
});

pool.getConnection().then((conn) => {
	console.log('Conexión a BD exitosa');
	conn.release();
}).catch((err) => {
	console.error('Error de conexión a BD:', err.message);
	process.exit(1);
});

export default pool;
