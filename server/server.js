require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const quotes = [
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" }
];

app.get('/api/quote', (req, res) => {
  const idx = Math.floor(Math.random() * quotes.length);
  res.json({ success: true, quote: quotes[idx] });
});

app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const key = process.env.OPENWEATHER_KEY;
    if (!key) return res.status(500).json({ success: false, message: 'OPENWEATHER_KEY not set' });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    const response = await axios.get(url);
    const data = response.data;
    const simplified = {
      city: data.name,
      temp: data.main.temp,
      condition: data.weather[0].description,
    };
    res.json({ success: true, weather: simplified });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Weather fetch failed' });
  }
});

// Fixed Currency API route with fallback and debug
app.get('/api/currency', async (req, res) => {
  try {
    const amountINR = parseFloat(req.query.amount || '1');
    if (isNaN(amountINR)) {
      return res.status(400).json({ success: false, message: 'Invalid amount value' });
    }

    // Try fetching real exchange rates
    try {
      const url = `https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR`;
      const response = await axios.get(url, { timeout: 10000 }); // 10 seconds timeout
      const rates = response.data.rates;

      if (rates && rates.USD && rates.EUR) {
        const usd = (amountINR * rates.USD).toFixed(4);
        const eur = (amountINR * rates.EUR).toFixed(4);
        return res.json({ success: true, result: { USD: usd, EUR: eur } });
      } else {
        console.warn("⚠️ API returned no valid rates, using fallback.");
      }
    } catch (apiErr) {
      console.error("❌ Currency API request failed:", apiErr.message);
    }

    // ✅ Fallback rates (approximate values)
    const fallbackRates = { USD: 0.012, EUR: 0.011 };
    const usdFallback = (amountINR * fallbackRates.USD).toFixed(4);
    const eurFallback = (amountINR * fallbackRates.EUR).toFixed(4);
    return res.json({
      success: true,
      result: { USD: usdFallback, EUR: eurFallback },
      note: "Used fallback rates because live API failed"
    });
  } catch (err) {
    console.error("Currency route final error:", err.message);
    res.status(500).json({ success: false, message: 'Currency fetch failed' });
  }
});

const path = require('path');

// Serve React build
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// SPA fallback: send index.html for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
