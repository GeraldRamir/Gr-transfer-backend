import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import reservasRoutes from './routes/reservas.js';
import clave from './routes/clave.js';
import dotenv from 'dotenv';
import colors from 'colors';
import webpush from 'web-push';
import Subscription from './models/Subscription.js';

dotenv.config();

webpush.setVapidDetails(
  'mailto:lucianormirezgerald@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log('Middleware - req.body:', req.body);
  next();
});

connectDB();
app.set('io', io);

app.use('/api/reservas', reservasRoutes);
app.use('/api/clave', clave);

// Ruta para recibir suscripción y enviar push

app.post('/api/subscribe', async (req, res) => {
  try {
    const subscription = req.body;

    // Validar que no esté ya registrada (evita duplicados)
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
      await Subscription.create(subscription);
    }

    // Payload opcional de prueba
    const payload = JSON.stringify({
      title: '¡Nueva reserva!',
      body: 'Se ha registrado una nueva reserva.',
    });

    // Enviar notificación de prueba (opcional)
    await webpush.sendNotification(subscription, payload);

    res.status(201).json({ message: 'Suscripción registrada y notificación enviada' });
  } catch (error) {
    console.error('Error en suscripción:', error);
    res.sendStatus(500);
  }
});

app.post('/api/notify', async (req, res) => {
  try {
    const { title, body } = req.body;

    const subscriptions = await Subscription.find();

    const payload = JSON.stringify({
      title: title || 'Nueva reserva',
      body: body || 'nueva reseerva registrada',
    });

    const resultados = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(sub, payload)
      )
    );

    res.status(200).json({ message: 'Notificaciones enviadas', resultados });
  } catch (err) {
    console.error('Error al enviar notificaciones:', err);
    res.sendStatus(500);
  }
});



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(colors.cyan.bold(`Servidor funcionando en el puerto ${PORT}`));
});
