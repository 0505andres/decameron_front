import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.options('*', cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

const hoteles = [
  { id: 1, nombre: 'Hotel Decameron Azul' },
  { id: 2, nombre: 'Hotel Decameron Playa' }
];

const tiposAcomodacion = [
  { id: 1, nombre: 'Suite' },
  { id: 2, nombre: 'Doble' }
];

const tiposHabitacion = [
  { id: 1, nombre: 'Estandar' },
  { id: 2, nombre: 'Premium' }
];

const habitaciones = [
  { id: 1, hotelId: 1, tipoAcomodacionId: 1, tipoHabitacionId: 1, codigo: 'A101' },
  { id: 2, hotelId: 1, tipoAcomodacionId: 1, tipoHabitacionId: 2, codigo: 'A102' },
  { id: 3, hotelId: 2, tipoAcomodacionId: 2, tipoHabitacionId: 1, codigo: 'B201' }
];

const reservas = [
  {
    id: 1,
    cliente: 'Luis Perez',
    numeroDocumento: '12345678',
    edad: 32,
    fechaIngreso: '2026-07-10',
    fechaSalida: '2026-07-15',
    hotel: 'Hotel Decameron Azul',
    tipoHabitacion: 'Estandar',
    habitacion: 'A101'
  }
];

app.get('/healthz', (req, res) => res.send('ok'));
app.get('/api/hotel', (req, res) => res.json(hoteles));
app.get('/api/tipo-acomodacion', (req, res) => res.json(tiposAcomodacion));
app.get('/api/tipo-habitacion', (req, res) => res.json(tiposHabitacion));
app.post('/api/habitacion/disponible', (req, res) => {
  const { hotelId, tipoAcomodacionId, tipoHabitacionId } = req.body;
  const disponibles = habitaciones.filter(
    (item) => item.hotelId === hotelId && item.tipoAcomodacionId === tipoAcomodacionId && item.tipoHabitacionId === tipoHabitacionId
  );
  res.json(disponibles.map(({ id, codigo }) => ({ id, codigo })));
});
app.get('/api/reserva', (req, res) => res.json(reservas));
app.post('/api/reserva', (req, res) => {
  const nextId = reservas.length + 1;
  const body = req.body;
  const hotel = hoteles.find((h) => h.id === body.hotelId)?.nombre || 'Desconocido';
  const tipoHabitacion = tiposHabitacion.find((t) => t.id === body.tipoHabitacionId)?.nombre || 'Desconocido';
  const habitacion = habitaciones.find((h) => h.id === body.habitacionId)?.codigo || 'Desconocido';
  const reserva = {
    id: nextId,
    cliente: body.cliente,
    numeroDocumento: body.numeroDocumento,
    edad: body.edad,
    fechaIngreso: body.fechaIngreso,
    fechaSalida: body.fechaSalida,
    hotel,
    tipoHabitacion,
    habitacion
  };
  reservas.push(reserva);
  res.status(201).json(reserva);
});
app.get('/api/hotel/rooms-report', (req, res) => {
  const report = hoteles.map((hotel) => {
    const totalHabitaciones = habitaciones.filter((h) => h.hotelId === hotel.id).length;
    const ocupadas = Math.floor(totalHabitaciones * Math.random());
    const ocupacion = totalHabitaciones ? Math.round((ocupadas / totalHabitaciones) * 100) : 0;
    return {
      hotel: hotel.nombre,
      totalHabitaciones,
      ocupadas,
      ocupacion
    };
  });
  res.json(report);
});

app.listen(8080, () => {
  console.log('Backend placeholder listening on http://localhost:8080');
});
