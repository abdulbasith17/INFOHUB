InfoHub — Validator Runbook (step-by-step)



Purpose: quick, repeatable steps for a human or automated validator to run, test, and verify the InfoHub project locally.



Prerequisites



Node.js (LTS) and npm installed. Verify:



node -v

npm -v





(Optional) git installed if validating from the GitHub repo:



git --version





Port 5000 and 5173 available (or set alternate ports and update config).



Project layout (paths used in commands)



Assumes project is in C:\\Users\\<user>\\Desktop\\Infohub (Windows) or ~/Infohub (macOS / Linux).



InfoHub/

├─ server/

│  ├─ server.js

│  ├─ package.json

│  └─ .env            # NOT committed (must be created by validator)

└─ client/

&nbsp;  ├─ package.json

&nbsp;  ├─ src/

&nbsp;  │  ├─ config.js

&nbsp;  │  └─ components/\*.jsx

&nbsp;  └─ ...



1\) Quick sanity check (optional)



If repo is on GitHub:



git clone https://github.com/<username>/InfoHub.git

cd InfoHub



2\) Setup and run the backend (Express)

2.1 Install

cd InfoHub/server

npm install



2.2 Create .env file (required)



Create InfoHub/server/.env with these two lines:



PORT=5000

OPENWEATHER\_KEY=YOUR\_OPENWEATHER\_API\_KEY





Replace YOUR\_OPENWEATHER\_API\_KEY with a valid OpenWeatherMap key. (If a key is not available, see fallback note below.)



2.3 Start the server



Start in production mode:



node server.js





Or use nodemon (auto-reload):



npx nodemon server.js



2.4 Expected server console output

✅ Server running on port 5000



2.5 Test backend API endpoints (direct tests)



Open browser or use curl / httpie to verify endpoints:



Quote



curl http://localhost:5000/api/quote

\# Expected: JSON, e.g.

\# {"success":true,"quote":{"text":"Do one thing...","author":"Eleanor Roosevelt"}}





Weather



curl "http://localhost:5000/api/weather?city=Delhi"

\# Expected: JSON with success true and weather object, e.g.

\# {"success":true,"weather":{"city":"Delhi","temp":29.5,"condition":"clear sky"}}





Currency



curl "http://localhost:5000/api/currency?amount=1000"

\# Expected: {"success":true,"result":{"USD":"12.0000","EUR":"11.0000"}} (values vary by rates)





If OPENWEATHER\_KEY missing or invalid the weather endpoint will return a meaningful error JSON such as:



{"success":false,"message":"OPENWEATHER\_KEY not set"}



3\) Setup and run the frontend (React + Vite)



Open a new terminal while backend keeps running.



3.1 Install

cd InfoHub/client

npm install



3.2 Ensure client API base config



Open client/src/config.js. It must point to the running backend for local validation:



export const API\_BASE = "http://localhost:5000";





(If your backend runs on a different host/port, update this value accordingly.)



3.3 Start dev server

npm run dev





Vite will print the local URL, usually:



VITE vX.X.X ready in ... ms

➜  Local: http://localhost:5173/



3.4 Open the UI



Open http://localhost:5173 in a browser. Expected behavior:



Page loads UI with three tabs/buttons: Weather, Currency, Quote (or labelled).



Clicking each tab shows the corresponding module UI.



Typing a city and clicking Get Weather fetches and displays city/temp/condition.



Typing an amount and clicking Convert fetches and displays USD/EUR conversion.



Clicking Get Quote shows a motivational quote.



4\) Acceptance tests (manual / automated)

A — Manual quick checklist (validator)



&nbsp;Server launched and prints ✅ Server running on port 5000.



&nbsp;GET /api/quote returns success: true and a quote object.



&nbsp;GET /api/weather?city=Delhi returns success: true and weather object.



&nbsp;GET /api/currency?amount=1000 returns success: true and result with USD \& EUR fields.



&nbsp;Frontend loads at http://localhost:5173 without console errors.



&nbsp;Weather UI: entering Delhi and clicking Get Weather shows valid temperature and condition.



&nbsp;Currency UI: entering 1000 and clicking Convert shows USD and EUR values.



&nbsp;Quote UI: clicking Get Quote shows a quote and author.



&nbsp;Background/theme changes when switching tabs (visual check).



&nbsp;No uncaught JavaScript errors in browser console (F12 → Console).



B — Example automated curl tests



Run these and expect HTTP 200 and JSON with success:true:



curl -sS http://localhost:5000/api/quote | jq

curl -sS "http://localhost:5000/api/weather?city=Delhi" | jq

curl -sS "http://localhost:5000/api/currency?amount=1000" | jq





(If jq not installed, inspect raw JSON output.)



5\) Production build (optional single-host test)



If validator prefers to test bundled app served by Express:



5.1 Build frontend

cd InfoHub/client

npm run build

\# creates dist/



5.2 Serve frontend from the server (temporary)



Copy the dist folder into the server folder or ensure server serves from ../client/dist.



If server.js already contains static serving lines, just restart the server.



Example static serve code (for server.js):



const path = require('path');

app.use(express.static(path.join(\_\_dirname, 'client', 'dist')));

app.get('\*', (req, res) => {

&nbsp; res.sendFile(path.join(\_\_dirname, 'client', 'dist', 'index.html'));

});





Restart server and open http://localhost:5000 — you should see the SPA served from the Express server.



6\) Troubleshooting (common issues \& fixes)



Blank page / UI not rendering



Open browser DevTools (F12) → Console. Fix first red JS error.



Ensure axios is installed in client: npm install axios inside client.



Ensure client/src/config.js exists and exports API\_BASE.



CORS errors when developing frontend locally



Server must app.use(cors()). Confirm server.js includes:



const cors = require('cors');

app.use(cors());





Restart server.



OPENWEATHER\_KEY errors



If OPENWEATHER\_KEY not set, create server/.env and restart server.



If API key invalid, sign up at https://openweathermap.org/

&nbsp;and obtain a free key.



Currency API failure



If exchange-rate service is down, server may return fallback values; validator should accept fallback but note note field in JSON (if implemented).



7\) Files to check for reviewers



server/server.js — backend implementation (routes: /api/quote, /api/weather, /api/currency)



server/.env — not included in repo; must be created with OPENWEATHER\_KEY



client/src/config.js — API base URL used by frontend



client/src/components/WeatherModule.jsx — front-end weather UI



client/src/components/CurrencyConverter.jsx — front-end currency UI



client/src/components/QuoteGenerator.jsx — front-end quote UI



8\) Expected JSON shapes (for validator automation)



/api/quote



{

&nbsp; "success": true,

&nbsp; "quote": { "text": "Do one thing...", "author": "Eleanor Roosevelt" }

}





/api/weather?city=Delhi



{

&nbsp; "success": true,

&nbsp; "weather": { "city": "Delhi", "temp": 29.5, "condition": "clear sky" }

}





/api/currency?amount=1000



{

&nbsp; "success": true,

&nbsp; "result": { "USD": "12.0000", "EUR": "11.0000" }

}





(Values will vary; validator should check presence of fields and success:true.)



9\) Scoring / Acceptance Criteria (suggested)



Run \& Launch (20%) — Server and client start without crashes.



API Correctness (30%) — All three API endpoints return correct JSON and expected fields.



Frontend Functionality (30%) — UI fetches from APIs, shows data, and shows loading/error states correctly.



Polish \& UX (20%) — Theming, background transitions, and responsive layout present.



10\) Final notes for the validator



If testing without OpenWeather API key: weather endpoint will return an explanatory error; still validate the quote and currency endpoints.



If currency external API is down, server will return fallback values; accept results with an accompanying note field indicating fallback.



If any problem occurs, please paste server console logs and browser console errors to the author for quick help.

