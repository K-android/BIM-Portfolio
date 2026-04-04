import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import dotenv from "dotenv";
import contactHandler from "./api/contact.ts"; // Import the handler

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route for Contact Form - Use the shared handler
  app.post("/api/contact", async (req, res) => {
    console.log("Received contact request:", req.body);
    try {
      await contactHandler(req, res);
    } catch (error) {
      console.error("Handler error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

  // Catch-all for API routes to ensure they always return JSON
  app.all("/api/*", (req, res) => {
    console.warn(`Unmatched API request: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

const appPromise = startServer();
export default appPromise;
