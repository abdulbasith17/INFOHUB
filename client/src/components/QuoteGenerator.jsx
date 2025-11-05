import React, { useState } from 'react';
import axios from 'axios';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/quote');
      if (res.data.success) setQuote(res.data.quote);
      else setError('Failed to fetch');
    } catch {
      setError('Error fetching quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Motivational Quote</h2>
      <button onClick={fetchQuote}>Get Quote</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quote && (
        <blockquote>
          <p>"{quote.text}"</p>
          <footer>- {quote.author || 'Unknown'}</footer>
        </blockquote>
      )}
    </section>
  );
}
