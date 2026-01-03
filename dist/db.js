"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Faltan variables de entorno de la BD en .env');
}
let ca;
try {
    ca = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'ca (1).pem'));
    console.log('Certificado CA cargado correctamente');
}
catch (err) {
    console.warn('ca (1).pem no encontrado. Intentando conectar sin certificado custom...', err);
}
const pool = promise_1.default.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: ca ? { ca, rejectUnauthorized: true } : 'REQUIRED'
});
pool.getConnection().then((conn) => {
    console.log('Conexión a BD exitosa');
    conn.release();
}).catch((err) => {
    console.error('Error de conexión a BD:', err.message);
    process.exit(1);
});
exports.default = pool;
//# sourceMappingURL=db.js.map