import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Travel Assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const model = "gemini-3.5-flash";
      
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const systemInstruction = `You are a professional AI Travel Assistant and Fare Manager for the Smart Transit System (APSRTC). 
      You help passengers with bus routes, timings, and tourist information across Andhra Pradesh cities including Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajahmundry, and Kakinada.
      You also help users calculate fares and announce available discounts:
      - Student discount: 20%
      - Senior citizen discount: 30%
      - Frequent Traveler discount: 15%
      - EV (Electric) Bus green routing discount: 10%
      You support 100+ languages including English, Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, Urdu, etc. Always respond in the language the user speaks.
      Be helpful, concise, and professional. Explain to users how they can book a ticket online through the Journey Planner.`;

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        }
      });

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Mock Real-time Bus Data
  app.get("/api/buses", (req, res) => {
    const city = (req.query.city as string) || 'Visakhapatnam';
    const seed = Math.floor(Date.now() / 5000);
    
    // Different buses based on city
    const baseBuses: Record<string, any[]> = {
      'Visakhapatnam': [
        { id: 'v1', busNumber: 'AP31Y1234', routeId: 'r1', type: 'City', status: 'on-time', occupancy: 'Medium', driverName: 'Ravi Kumar', capacity: 45, lat: 17.7126, lng: 83.3330, speed: 45, nextStopId: 'NAD Junction', eta: 5, routePath: [{ lat: 17.7259, lng: 83.3039 }, { lat: 17.7297, lng: 83.2396 }, { lat: 17.6888, lng: 83.2104 }] },
        { id: 'v2', busNumber: 'AP31Z5678', routeId: 'r2', type: 'Electric', status: 'approaching', occupancy: 'Low', driverName: 'Suresh Babu', capacity: 35, lat: 17.8184, lng: 83.3444, speed: 40, nextStopId: 'Madhurawada', eta: 2, routePath: [{ lat: 17.7259, lng: 83.3039 }, { lat: 17.7447, lng: 83.3364 }, { lat: 17.8184, lng: 83.3444 }] },
        { id: 'v3', busNumber: 'AP31X9012', routeId: 'r3', type: 'Metro', status: 'delayed', occupancy: 'High', driverName: 'M. Rao', capacity: 60, lat: 17.6913, lng: 83.0039, speed: 55, nextStopId: 'RTC Complex', eta: 15, routePath: [{ lat: 17.6913, lng: 83.0039 }, { lat: 17.7297, lng: 83.2396 }, { lat: 17.7259, lng: 83.3039 }] },
        { id: 'v4', busNumber: 'AP31V4444', routeId: 'r4', type: 'AC', status: 'on-time', occupancy: 'Medium', driverName: 'P. Prasad', capacity: 40, lat: 17.7150, lng: 83.3250, speed: 30, nextStopId: 'RK Beach', eta: 3, routePath: [{ lat: 17.7259, lng: 83.3039 }, { lat: 17.7126, lng: 83.3330 }, { lat: 17.7447, lng: 83.3364 }] },
        { id: 'v5', busNumber: 'AP31W5555', routeId: 'r5', type: 'Express', status: 'heavy-delay', occupancy: 'High', driverName: 'Satish', capacity: 50, lat: 17.8894, lng: 83.4475, speed: 65, nextStopId: 'Bheemili', eta: 25, routePath: [{ lat: 17.7259, lng: 83.3039 }, { lat: 17.8184, lng: 83.3444 }, { lat: 17.8894, lng: 83.4475 }] },
      ],
      'Vijayawada': [
        { id: 'wj1', busNumber: 'AP16Y4321', routeId: 'w1', type: 'City', status: 'on-time', occupancy: 'High', driverName: 'K. Reddy', capacity: 50, lat: 16.50, lng: 80.64, speed: 35, nextStopId: 'Benz Circle', eta: 8 },
        { id: 'wj2', busNumber: 'AP16Z9999', routeId: 'w2', type: 'Electric', status: 'delayed', occupancy: 'Low', driverName: 'G. Naidu', capacity: 35, lat: 16.51, lng: 80.62, speed: 42, nextStopId: 'PNBS', eta: 12 },
      ],
      'Tirupati': [
        { id: 'tp1', busNumber: 'AP03X7777', routeId: 't1', type: 'Express', status: 'on-time', occupancy: 'Medium', driverName: 'Bhaskar', capacity: 40, lat: 13.62, lng: 79.41, speed: 50, nextStopId: 'Alipiri', eta: 10 },
        { id: 'tp2', busNumber: 'AP03W1111', routeId: 't2', type: 'City', status: 'approaching', occupancy: 'High', driverName: 'Anand', capacity: 55, lat: 13.63, lng: 79.42, speed: 30, nextStopId: 'RTC Bus Stand', eta: 3 },
      ],
      'Guntur': [
        { id: 'gt1', busNumber: 'AP07Y2222', routeId: 'g1', type: 'City', status: 'on-time', occupancy: 'Low', driverName: 'Venkat', capacity: 50, lat: 16.30, lng: 80.44, speed: 45, nextStopId: 'Lodge Centre', eta: 6 },
      ],
      'Rajahmundry': [
        { id: 'rj1', busNumber: 'AP05X3333', routeId: 'rj1', type: 'Express', status: 'delayed', occupancy: 'Medium', driverName: 'Somu', capacity: 45, lat: 17.00, lng: 81.78, speed: 40, nextStopId: 'Godavari Bridge', eta: 20 },
      ],
      'Kakinada': [
        { id: 'kk1', busNumber: 'AP04Z4444', routeId: 'k1', type: 'City', status: 'on-time', occupancy: 'High', driverName: 'Prasad', capacity: 50, lat: 16.98, lng: 82.24, speed: 35, nextStopId: 'RTC Complex', eta: 5 },
      ]
    };

    const cityBuses = baseBuses[city] || baseBuses['Visakhapatnam'];

    const buses = cityBuses.map((b: any, index: number) => ({
      ...b,
      lat: b.lat + (Math.sin(seed * (0.1 + index * 0.05)) * 0.01),
      lng: b.lng + (Math.cos(seed * (0.1 + index * 0.05)) * 0.01),
      heading: (seed * 10) % 360,
    }));

    res.json(buses);
  });

  // API Route: Journey Planner
  app.get("/api/journey/:busId", (req, res) => {
    const { busId } = req.params;
    
    // Find bus locally if possible to get correct busNumber
    const journey = {
      busId,
      routeId: 'r1',
      busNumber: busId.startsWith('v') ? `AP31-${busId.toUpperCase()}` : 'AP-SMART-BUS',
      stops: [
        { stopId: 's1', name: 'Boarding Point', eta: 0, distance: 0 },
        { stopId: 's2', name: 'Intermediate Hub', eta: 4, distance: 2.1 },
        { stopId: 's3', name: 'Transit Junction', eta: 10, distance: 5.4 },
        { stopId: 's4', name: 'Commercial Zone', eta: 18, distance: 8.9 },
        { stopId: 's5', name: 'Final Destination', eta: 28, distance: 12.5 },
      ]
    };
    res.json(journey);
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
