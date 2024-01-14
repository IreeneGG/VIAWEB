
/*-----IMPORTAR------- */
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');  // Importa el paquete cors
const app = express();
const port = 2000;//puerto

// Configura CORS 
app.use(cors());

/*----- MONGO------- */

//Base de datos-->datosviajes
mongoose.connect('mongodb://127.0.0.1:27017/datosviajes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define el esquema de Mongoose para los viajes
const tripSchema = new mongoose.Schema({
  tripID: String,
  destination: String,
  startDate: String,
  endDate: String,
  durationDays: Number,
  travelerName: String,
  travelerAge: Number,
  travelerGender: String,
  travelerNationality: String,
  accommodationType: String,
  accommodationCost: Number,
  transportationType: String,
  transportationCost: Number,
});

// Crea el modelo de Mongoose 
const Trip = mongoose.model('Trip', tripSchema);


// Función para convertir strings de costos a números
const parseCost = (costString) => {
  const number = parseFloat(costString.replace(/,/g, ''));
  return isNaN(number) ? 0 : number;
};


//(endpoint)
/**
 * @swagger
 * /load-trips:
 *   get:
 *     summary: Cargar datos de viajes desde un archivo JSON a la base de datos.
 *     description: Lee los datos desde un archivo JSON y los almacena en la base de datos MongoDB.
 *     responses:
 *       200:
 *         description: Datos de viajes almacenados con éxito en MongoDB.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al cargar los datos de viajes.
 */
app.get('/load-trips', async (req, res) => {
  try {
    // Lee los datos desde el archivo JSON
    const data = fs.readFileSync('./data/localization.json', 'utf8');
    const jsonData = JSON.parse(data);

    const tripsArray = jsonData["Travel details dataset"];

    // Verifica que hay array para mapear
    if (!Array.isArray(tripsArray)) {
      throw new TypeError('Los datos cargados no son un arreglo');
    }

    // Borra todos los documentos existentes en la colección 'Trip'
    await Trip.deleteMany({});
    
    const tripsToInsert = tripsArray.map(trip => ({
      //tripID: trip['Trip ID+A40A1:M130'],
      tripID: trip.tripID,
      destination: trip.Destination.split(',')[0].trim(),
      startDate: trip['Start date'],
      endDate: trip['End date'],
      durationDays: parseInt(trip['Duration (days)']),
      travelerName: trip['Traveler name'],
      travelerAge: parseInt(trip['Traveler age']),
      travelerGender: trip['Traveler gender'],
      travelerNationality: trip['Traveler nationality'],
      accommodationType: trip['Accommodation type'],
      accommodationCost: parseCost(trip['Accommodation cost']),
      transportationType: trip['Transportation type'],
      transportationCost: parseCost(trip['Transportation cost']),
    }));

    // Inserta los nuevos documentos en la base de datos
    await Trip.insertMany(tripsToInsert);

    res.json({ message: 'Datos de viajes almacenados con éxito en MongoDB' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*--------RUTAS------- */
//EN USO
/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Obtener todos los viajes.
 *     description: Retorna una lista de todos los viajes almacenados en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de viajes obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Error interno del servidor al recuperar los viajes.
 */
app.get('/trips', async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los viajes: ' + error.message });
  }

});

//muestra los viajes según edad
app.get('/trips/age/:age', async (req, res) => {
  const maxAge = parseInt(req.params.age);
  try {
    const trips = await Trip.find({ travelerAge: { $lt: maxAge } });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los viajes: ' + error.message });
  }
});

//EN USO
/**
 * @swagger
 * /travel/trips/destinations:
 *   get:
 *     summary: Obtener todos los destinos distintos.
 *     description: Obtiene una lista de todos los destinos distintos a los que se ha viajado.
 *     responses:
 *       200:
 *         description: Lista de destinos distintos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tripID:
 *                     type: string
 *                   destination:
 *                     type: string
 *                 required:
 *                   - tripID
 *                   - destination
 *     500:
 *       description: Error al recuperar las destinaciones.
 */
app.get('/travel/trips/destinations', async (req, res) => {
  try {
    const uniqueDestinations = await Trip.aggregate([
      { $group: { _id: '$destination', tripID: { $first: '$tripID' } } },
      { $project: { _id: 0, destination: '$_id', tripID: 1 } }
    ]);

    res.json(uniqueDestinations);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar las destinaciones: ' + error.message });
  }
});





//viajes en base al transporte
app.get('/trips/transportation/:type', async (req, res) => {
  const type = req.params.type;
  try {
    const trips = await Trip.find({ transportationType: type });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los viajes por tipo de transporte: ' + error.message });
  }
});

//viajes según el genero
app.get('/trips/gender/:gender', async (req, res) => {
  const gender = req.params.gender;
  try {
    const trips = await Trip.find({ travelerGender: gender });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los viajes por género: ' + error.message });
  }
});


/**
 * @swagger
 * /trips/transportation-types:
 *   get:
 *     summary: Obtener lista de tipos de transporte.
 *     description: Este endpoint devuelve una lista única de todos los tipos de transporte disponibles en la colección de viajes.
 *     tags:
 *       - Trips
 *     responses:
 *       200:
 *         description: Una lista de tipos de transporte fue devuelta exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: Avión
 *       500:
 *         description: Error interno del servidor al recuperar los tipos de transporte.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Error al recuperar los tipos de transporte
 */

app.get('/trips/transportation-types', async (req, res) => {
  try {
    const transportationTypes = await Trip.distinct('transportationType');
    res.json(transportationTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los tipos de transporte: ' + error.message });
  }
});

//EN USO
/**
 * @swagger
 * /travel/trips/destinations/{destinationName}:
 *   get:
 *     summary: Obtener detalles de un destino por nombre.
 *     description: Obtiene detalles de un destino específico basado en su nombre.
 *     parameters:
 *       - in: path
 *         name: destinationName
 *         required: true
 *         description: Nombre del destino que se desea buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del destino encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tripID:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                 endDate:
 *                   type: string
 *                 durationDays:
 *                   type: number
 *                 travelerName:
 *                   type: string
 *                 travelerAge:
 *                   type: number
 *                 travelerGender:
 *                   type: string
 *                 travelerNationality:
 *                   type: string
 *                 accommodationType:
 *                   type: string
 *                 accommodationCost:
 *                   type: number
 *                 transportationType:
 *                   type: string
 *                 transportationCost:
 *                   type: number
 *               required:
 *                 - tripID
 *                 - destination
 *       404:
 *         description: No se encontró el destino con el nombre proporcionado.
 *       500:
 *         description: Error al recuperar los detalles del destino.
 */
app.get('/travel/trips/destinations/:destinationName', async (req, res) => {
  const destinationName = req.params.destinationName;

  try {
    // Suponiendo que 'destination' es el campo que contiene el nombre del destino en tu esquema de Trip
    const destinationDetails = await Trip.findOne({ destination: destinationName });

    if (!destinationDetails) {
      return res.status(404).json({ error: 'No se encontró el destino con el nombre proporcionado' });
    }

    res.json(destinationDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los detalles del destino: ' + error.message });
  }
});

//EN USO
/**
 * @swagger
 * /travel/trips/destinationsByID/{tripID}:
 *   get:
 *     summary: Obtener detalles de un destino por ID.
 *     description: Obtiene detalles de un destino específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: tripID
 *         required: true
 *         description: ID del destino que se desea buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del destino encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tripID:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                 endDate:
 *                   type: string
 *                 durationDays:
 *                   type: number
 *                 travelerName:
 *                   type: string
 *                 travelerAge:
 *                   type: number
 *                 travelerGender:
 *                   type: string
 *                 travelerNationality:
 *                   type: string
 *                 accommodationType:
 *                   type: string
 *                 accommodationCost:
 *                   type: number
 *                 transportationType:
 *                   type: string
 *                 transportationCost:
 *                   type: number
 *               required:
 *                 - tripID
 *                 - destination
 *       404:
 *         description: No se encontró el destino con el ID proporcionado.
 *       500:
 *         description: Error al recuperar los detalles del destino.
 */
app.get('/travel/trips/destinationsByID/:tripID', async (req, res) => {
  const tripID = req.params.tripID;

  try {
    const destinationDetails = await Trip.findOne({ tripID: tripID });

    if (!destinationDetails) {
      return res.status(404).json({ error: 'No se encontró el destino con el ID proporcionado' });
    }

    res.json(destinationDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar los detalles del destino: ' + error.message });
  }
});

//EN USO
/**
 * @swagger
 * /travel/trips/destinations/{DestinationName}/transportation-types:
 *   get:
 *     summary: Obtener tipos de transporte para un destino específico.
 *     description: Obtiene la cantidad de cada tipo de transporte utilizado en los viajes a un destino específico.
 *     parameters:
 *       - in: path
 *         name: DestinationName
 *         required: true
 *         description: Nombre del destino para el que se desea obtener los tipos de transporte.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipos de transporte y su cantidad.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transportTypeCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *               required:
 *                 - transportTypeCounts
 *       404:
 *         description: No se encontró información de transporte para el destino con el nombre proporcionado.
 *       500:
 *         description: Error al recuperar la información de transporte.
 */
app.get('/travel/trips/destinations/:DestinationName/transportation-types', async (req, res) => {
  const DestinationName = req.params.DestinationName;

  try {
    const matchingTrips = await Trip.find({ destination: DestinationName }, 'transportationType');

    if (matchingTrips.length === 0) {
      return res.status(404).json({ error: 'No se encontró información de transporte para el destino con el nombre proporcionado' });
    }

    // Crear un objeto para contar la cantidad de cada tipo de transporte
    const transportTypeCounts = {};

    // Contar la cantidad de cada tipo de transporte
    matchingTrips.forEach((trip) => {
      const transportType = trip.transportationType;
      if (transportTypeCounts[transportType]) {
        transportTypeCounts[transportType]++;
      } else {
        transportTypeCounts[transportType] = 1;
      }
    });

    res.json(transportTypeCounts);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar la información de transporte: ' + error.message });
  }
});
//EN USO
/**
 * @swagger
 * /travel/trips/destinations/{DestinationName}/accommodation-types:
 *   get:
 *     summary: Obtener tipos de alojamiento para un destino específico.
 *     description: Obtiene la cantidad de cada tipo de alojamiento utilizado en los viajes a un destino específico.
 *     parameters:
 *       - in: path
 *         name: DestinationName
 *         required: true
 *         description: Nombre del destino para el que se desea obtener los tipos de alojamiento.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipos de alojamiento y su cantidad.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accommodationTypeCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *               required:
 *                 - accommodationTypeCounts
 *       404:
 *         description: No se encontró información de alojamiento para el destino con el nombre proporcionado.
 *       500:
 *         description: Error al recuperar la información de alojamiento.
 */
app.get('/travel/trips/destinations/:DestinationName/accommodation-types', async (req, res) => {
  const DestinationName = req.params.DestinationName;

  try {
    const matchingTrips = await Trip.find({ destination: DestinationName }, 'accommodationType');

    if (matchingTrips.length === 0) {
      return res.status(404).json({ error: 'No se encontró información de alojamiento para el destino con el nombre proporcionado' });
    }

    // Crear un objeto para contar la cantidad de cada tipo de alojamiento
    const accommodationTypeCounts = {};

    // Contar la cantidad de cada tipo de alojamiento
    matchingTrips.forEach((trip) => {
      const accommodationType = trip.accommodationType;
      if (accommodationTypeCounts[accommodationType]) {
        accommodationTypeCounts[accommodationType]++;
      } else {
        accommodationTypeCounts[accommodationType] = 1;
      }
    });

    res.json(accommodationTypeCounts);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar la información de alojamiento: ' + error.message });
  }
});

// Configura Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Viajes',
      version: '1.0.0',
      description: 'Documentación de la API de Viajes',
    },
  },
  apis: [__filename], // Ruta al archivo actual (main.js)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Agrega Swagger a Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




// Inicia el servidor en el puerto 2000
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


