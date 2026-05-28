import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const MOCK_VOLUNTEER_API = 'https://script.google.com/macros/s/AKfycbxT9ID_TeoeA_Xd46QkeGHnb7sqSWj4sRSKfVP_ygnjrIHlZ2qveSqxVw4Hm2vT48oHNA/exec';
const RATING_API = 'https://script.google.com/macros/s/AKfycbxAR0tyczm3-HDjdub3R-Xy1uoZ4T42Athz8VkJN5bk4gcO_GyVmyOiOBV0BCMEPKpeYg/exec';
const CYBER_AUTH_API = 'https://script.google.com/macros/s/AKfycbxGOW2caEmqW51hNmTe3Kq24D-UzfhKuhtS3xMP0OB9WNCjxKvwSGU5W4VnszDjfdZw/exec';
const MAIN_APP_API = 'https://script.google.com/macros/s/AKfycbwGbahUGJP18GWmkPsTF9KbNG-KSu26lgAHOXoSIk3y2DEbuhAM_la3-DwkDDQghM-j/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled to allow inline scripts and React/Vite dev styles
    crossOriginEmbedderPolicy: false,
  }));
  
  app.use(cors({
    origin: '*', // Adjust this for stricter CORS if required (e.g., your domain)
    methods: ['GET', 'POST']
  }));

  // Rate Limiting (Prevent DDoS / Brute Force on APIs)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 API requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    validate: { xForwardedForHeader: false, trustProxy: false, default: true }
  });

  app.use('/api/', apiLimiter);
  app.use(express.json({ limit: '10kb' })); // Limit JSON body payload size

  // API Route: Mock Volunteer
  app.post('/api/volunteer', async (req, res) => {
    try {
      const response = await fetch(MOCK_VOLUNTEER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Rating
  app.post('/api/rating', async (req, res) => {
    try {
      const response = await fetch(RATING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Cyber Auth
  app.post('/api/auth', async (req, res) => {
    try {
      const response = await fetch(CYBER_AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Main App
  app.post('/api/main', async (req, res) => {
    try {
      const response = await fetch(MAIN_APP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: App Wakeup Get Error code
  app.get('/api/main', async (req, res) => {
     try {
       const { action } = req.query;
       const url = `${MAIN_APP_API}?action=${action}`;
       const response = await fetch(url, {
         method: 'GET'
       });
       
       if (action === 'wakeup') {
           const text = await response.text();
           return res.send(text);
       } else {
           const data = await response.json();
           return res.json(data);
       }
       
     } catch(err: any) {
         res.status(500).json({ error: err.message });
     }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
