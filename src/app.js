const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
//app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cors({
  origin: [
    'https://growth-fit-frontend.vercel.app',
  ],
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rutas
app.use('/auth', require('./modules/auth/auth.routes'));
app.use('/gyms', require('./modules/gyms/gyms.routes'));
app.use('/clients', require('./modules/clients/clients.routes'));
app.use('/payments', require('./modules/payments/payments.routes'));
app.use('/dashboard', require('./modules/dashboard/dashboard.routes'));
app.use('/generics', require('./modules/generics/generics.routes'));

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

module.exports = app;
