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
	DB_NAME
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
	throw new Error('Faltan variables de entorno de la BD en .env');
}

let ca: Buffer | undefined;
try {
	ca = fs.readFileSync(path.join(process.cwd(), 'ca (1).pem'));
	console.log('Certificado CA cargado correctamente');
} catch (err) {
	console.warn('ca (1).pem no encontrado. Intentando conectar sin certificado custom...', err);
}

const pool = mysql.createPool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	ssl: ca ? { ca, rejectUnauthorized: true } : {}
});

pool.getConnection().then((conn) => {
	console.log('Conexión a BD exitosa');
	conn.release();
}).catch((err) => {
	console.error('Error de conexión a BD:', err.message);
	process.exit(1);
});

export default pool;
