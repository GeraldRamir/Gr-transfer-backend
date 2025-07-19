import express from 'express';
import ClaveDashboard from '../models/ClaveDashboard.js';

const router = express.Router();

// GET: Obtener la clave actual
router.get('/', async (req, res) => {
  try {
    const clave = await ClaveDashboard.findOne({ activa: true });
    if (!clave) {
      return res.status(404).json({ mensaje: 'No hay clave almacenada' });
    }
    res.json(clave);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la clave', error: error.message });
  }
});

// POST: Crear clave si no existe una ya
router.post('/', async (req, res) => {
  try {
    const { clave } = req.body;
    if (!clave) {
      return res.status(400).json({ mensaje: 'Debe enviar una clave' });
    }

    const existente = await ClaveDashboard.findOne({ activa: true });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe una clave activa. No se puede crear otra.' });
    }

    const nuevaClave = new ClaveDashboard({ clave, activa: true });
    await nuevaClave.save();

    res.status(201).json({ mensaje: 'Clave creada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar la clave', error: error.message });
  }
});

// PUT: Actualizar clave existente
router.put('/', async (req, res) => {
  try {
    const { clave } = req.body;
    if (!clave) {
      return res.status(400).json({ mensaje: 'Debe enviar una nueva clave' });
    }

    const existente = await ClaveDashboard.findOne({ activa: true });
    if (!existente) {
      return res.status(404).json({ mensaje: 'No existe una clave activa para actualizar' });
    }

    existente.clave = clave;
    existente.creadaEn = Date.now();
    await existente.save();

    res.json({ mensaje: 'Clave actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la clave', error: error.message });
  }
});

// Opcional extra: Verificar clave ingresada
router.post('/verificar', async (req, res) => {
  try {
    const { clave } = req.body;
    if (!clave) {
      return res.status(400).json({ mensaje: 'Debe enviar una clave' });
    }

    const almacenada = await ClaveDashboard.findOne({ activa: true });
    if (!almacenada) {
      return res.status(404).json({ mensaje: 'No hay clave registrada' });
    }

    if (clave === almacenada.clave) {
      return res.status(200).json({ acceso: true, mensaje: 'Clave correcta' });
    } else {
      return res.status(401).json({ acceso: false, mensaje: 'Clave incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar la clave', error: error.message });
  }
});

export default router;
