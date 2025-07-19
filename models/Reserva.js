import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  fecha: String,
  personas: Number,
  mensaje: String,
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reserva', reservaSchema);
