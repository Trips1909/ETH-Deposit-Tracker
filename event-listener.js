const EventSource = require("eventsource");
const mongoose = require("mongoose");
const Deposit = require("./models/Deposit");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Telegram Bot Configuration
const telegramBotToken = "7097063806:AAGbux5e07-ziU2hDDz__pod4Ihwd2FuqMg";
const chatId = "5806425999";

/**
 * Sends a message to a Telegram chat.
 * @param {string} message - The message to send.
 */
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Telegram message sent:", data);
    } else {
      console.error("Failed to send message:", data);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

// Create a new EventSource object to listen to the webhook URL
const eventSource = new EventSource("https://smee.io/dv9FiGxnrYr2HltC");

// Event listener for incoming messages
eventSource.onmessage = async (event) => {
  try {
    const data = JSON.parse(event.data);

    // Extract relevant data
    if (data.body && data.body.event && data.body.event.activity) {
      const activities = data.body.event.activity;
      for (const activity of activities) {
        const newDeposit = new Deposit({
          blockNumber: activity.blockNum,
          blockTimestamp: new Date(), // or extract from activity if available
          fee: 0, // Set this if you have fee information
          hash: activity.hash,
          pubkey: activity.fromAddress, // Assuming pubkey is the fromAddress
        });

        try {
          await newDeposit.save();
          console.log(`Deposit saved: ${activity.hash}`);

          // Send Telegram notification
          await sendTelegramMessage(
            `New deposit detected with hash: ${activity.hash}`
          );
        } catch (error) {
          console.error(`Error saving deposit ${activity.hash}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

// Event listener for errors
eventSource.onerror = (error) => {
  console.error("EventSource error:", error);
};

// Event listener for open connection
eventSource.onopen = () => {
  console.log("Connection to event source opened.");
};
