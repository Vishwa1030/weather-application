const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost/weatherApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Weather API key (replace with your OpenWeatherMap API key)
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';

// MongoDB schema for saved cities
const citySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});
const City = mongoose.model('City', citySchema);

// API routes

// Get weather data for a city
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        res.json(weatherResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save a city to favorites
app.post('/api/cities/save', async (req, res) => {
    try {
        const cityName = req.body.name;
        const newCity = new City({ name: cityName });
        await newCity.save();
        res.json(newCity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all saved cities
app.get('/api/cities/all', async (req, res) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve the React app
app.use(express.static('client/build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
