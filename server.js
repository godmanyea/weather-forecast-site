import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const forecastSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  condition: String,
  humidity: Number,
  forecast: String,
  timestamp: { type: Date, default: Date.now },
});

const Forecast = mongoose.model("Forecast", forecastSchema);

app.post("/api/save-forecast", async (req, res) => {
  try {
    const data = new Forecast(req.body);
    await data.save();
    res.status(200).json({ message: "Forecast saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save forecast" });
  }
});

app.get("/api/forecasts", async (req, res) => {
  try {
    const forecasts = await Forecast.find().sort({ timestamp: -1 }).limit(10);
    res.json(forecasts);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve forecasts" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
