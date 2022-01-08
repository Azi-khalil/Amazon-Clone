const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51KBIugL0OU7vEOuWKIEww5xlsGCn0oJoLs5WdzMCEmbeMbGPtgunww5ZGdWEqS4z7FfwZwjSNGvN1QDSfnc8NV5m00IFs0ffLe"
);

// API

// - App config
const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - API routes
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
    const total = request.query.total;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    // OK - Created
    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  });

// - Listen command
exports.api = functions.https.onRequest(app);
