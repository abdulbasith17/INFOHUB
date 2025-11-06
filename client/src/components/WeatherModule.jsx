import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherModule() {
  const [city, setCity] = useState('London');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`);

      if (res.data.success) setData(res.data.weather);
      else setError('Failed to load data');
    } catch {
      setError('Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  return (
    <section>
      <h2>Weather</h2>
      <input value={city} onChange={e => setCity(e.target.value)} />
      <button onClick={fetchWeather}>Get Weather</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <p><strong>City:</strong> {data.city}</p>
          <p><strong>Temp:</strong> {data.temp} °C</p>
          <p><strong>Condition:</strong> {data.condition}</p>
        </div>
      )}
    </section>
  );
}