import express from 'express';
import Reserva from '../models/Reserva.js';

const router = express.Router();

// Validar clave de acceso al dashboard


// Crear nueva reserva
router.post('/', async (req, res) => {
  try {
    const nueva = new Reserva(req.body);
    await nueva.save();

    const io = req.app.get('io');
    io.emit('nueva-reserva', nueva);

    res.status(201).json({ message: 'Reserva enviada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar reserva' });
  }
});

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ creadoEn: -1 });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Eliminar una reserva
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const io = req.app.get('io');
    io.emit('reserva-eliminada', reservaEliminada);

    res.json({ message: 'Reserva eliminada correctamente', reserva: reservaEliminada });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar reserva' });
  }
});

export default router;
