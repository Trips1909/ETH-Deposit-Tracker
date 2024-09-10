require("dotenv").config();
const { Alchemy, Network } = require("alchemy-sdk");
const mongoose = require("mongoose");
const Deposit = require("./models/Deposit");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// const { ethers } = require("ethers");

// Set up Alchemy or Infura RPC provider
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.ALCHEMY_API_URL
// );

// const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: process.env.ALCHEMY_API_URL, // Use environment variable for API key
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

alchemy.core
  .getAssetTransfers({
    toAddress: "0x00000000219ab540356cBB839Cbe05303d7705Fa",
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
  })
  .then((transfers) => {
    transfers.transfers.forEach(async (tx) => {
      // Create a new deposit instance
      const newDeposit = new Deposit({
        blockNum: tx.blockNum,
        uniqueId: tx.uniqueId,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        asset: tx.asset,
        category: tx.category,
        rawContract: tx.rawContract,
      });

      // Save the deposit to MongoDB
      try {
        await newDeposit.save();
        console.log(`Deposit saved: ${tx.hash}`);
      } catch (error) {
        console.error(`Error saving deposit ${tx.hash}:`, error);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching deposits:", error);
  });

const fetch = require("node-fetch");

// Replace these values with your own
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

// Example usage
sendTelegramMessage(
  "New deposit detected with hash: 0x7a4a39da2a3fa1fc2ef88fd1eaea070286ed2aba21e0419dcfb6d5c5d9f02a72"
);

// console.log(data);

// const BEACON_DEPOSIT_ADDRESS = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

// async function fetchDeposits(blockNumber) {
//   const block = await provider.getBlockWithTransactions(blockNumber);

//   //   block.transactions.forEach((tx) => {
//   //     if (tx.to === BEACON_DEPOSIT_ADDRESS) {
//   //       console.log(`Deposit Transaction Found: ${tx.hash}`);
//   //       recordDeposit(tx);
//   //     }
//   //   });
// }

// provider.on("block", async (blockNumber) => {
//   console.log(`New Block: ${blockNumber}`);
//   await fetchDeposits(blockNumber);
// });
