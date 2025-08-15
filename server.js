// server.js
const express = require("express");
const app = express();

app.use(express.json());

// Quick health check (for your browser and Render)
app.get("/", (req, res) => {
  res.send("MIE bridge is running ✅");
});

// Alexa webhook endpoint
app.post("/", (req, res) => {
  console.log("Alexa request:", JSON.stringify(req.body, null, 2));

  // Minimal valid Alexa response
  const response = {
    version: "1.0",
    response: {
      shouldEndSession: false,
      outputSpeech: {
        type: "PlainText",
        text: "Hello from MIE! Your Alexa skill is now connected.",
      },
    },
  };

  res.json(response);
});

// Listen on the port Render provides (or 3000 locally)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MIE bridge listening on port ${PORT}`);
});
