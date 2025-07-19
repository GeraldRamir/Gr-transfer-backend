import mongoose from 'mongoose';

const claveDashboardSchema = new mongoose.Schema({
  clave: {
    type: String,
    required: true,
  },
  activa: {
    type: Boolean,
    default: true,
  },
  creadaEn: {
    type: Date,
    default: Date.now,
  }
});

// Crear índice único parcial para que solo un documento tenga activa=true
claveDashboardSchema.index({ activa: 1 }, { unique: true, partialFilterExpression: { activa: true } });

export default mongoose.model('ClaveDashboard', claveDashboardSchema);
