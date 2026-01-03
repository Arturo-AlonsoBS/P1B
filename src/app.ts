import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/saludos', async (req: any, res: any) => {
	try {
		const [rows] = await pool.query('SELECT id, mensaje FROM hola');
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error en la base de datos' });
	}
});

app.post('/api/saludos', async (req: any, res: any) => {
	const { mensaje } = req.body;
	if (!mensaje || typeof mensaje !== 'string') {
		return res.status(400).json({ error: 'campo "mensaje" requerido' });
	}
	try {
		const [result]: any = await pool.execute('INSERT INTO hola (mensaje) VALUES (?)', [mensaje]);
		res.status(201).json({ id: result.insertId, mensaje });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error en la base de datos' });
	}
});

app.delete('/api/saludos/:id', async (req: any, res: any) => {
	const { id } = req.params;
	try {
		const [result]: any = await pool.execute('DELETE FROM hola WHERE id = ?', [id]);
		if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error en la base de datos' });
	}
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
