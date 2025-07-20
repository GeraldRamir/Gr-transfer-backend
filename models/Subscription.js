import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  },
  ruta: { type: String, required: true }, // 👈 propiedad ruta obligatoria
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Subscription', subscriptionSchema);
