import React, { useState } from 'react';
import axios from 'axios';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convert = async () => {
    setLoading(true);
    setError('');
    try {
      // ✅ using full backend URL
      const res = await axios.get(`http://localhost:5000/api/currency?amount=${encodeURIComponent(amount)}`);
      if (res.data.success) {
        setResult(res.data.result);
      } else {
        setError('No conversion data found.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch conversion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: 20 }}>
      <h2>Currency Converter (INR → USD / EUR)</h2>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter INR amount"
      />
      <button onClick={convert}>Convert</button>

      {loading && <p>Converting...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 10, background: '#fff', padding: 10, borderRadius: 6 }}>
          <p><strong>USD:</strong> {result.USD}</p>
          <p><strong>EUR:</strong> {result.EUR}</p>
        </div>
      )}
    </section>
  );
}