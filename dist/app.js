"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/saludos', async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT id, mensaje FROM hola');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});
app.post('/api/saludos', async (req, res) => {
    const { mensaje } = req.body;
    if (!mensaje || typeof mensaje !== 'string') {
        return res.status(400).json({ error: 'campo "mensaje" requerido' });
    }
    try {
        const [result] = await db_1.default.execute('INSERT INTO hola (mensaje) VALUES (?)', [mensaje]);
        res.status(201).json({ id: result.insertId, mensaje });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});
app.delete('/api/saludos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db_1.default.execute('DELETE FROM hola WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'No encontrado' });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map