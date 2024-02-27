const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/weatherApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Weather Schema
const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  humidity: Number,
  windSpeed: Number
});
const Weather = mongoose.model('Weather', weatherSchema);

// Routes
app.post('/weather', async (req, res) => {
  const { city, temperature, humidity, windSpeed } = req.body;
  const newWeather = new Weather({
    city,
    temperature,
    humidity,
    windSpeed
  });
  try {
    await newWeather.save();
    res.status(201).send('Weather saved successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/weather', async (req, res) => {
  try {
    const weathers = await Weather.find();
    res.json(weathers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
