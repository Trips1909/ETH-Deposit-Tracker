# ETH Deposit Tracker

A Node.js application to monitor and record ETH deposits on the Beacon Deposit Contract using Ethereum RPC methods, Alchemy SDK, MongoDB, and Telegram notifications.

## Features
- Real-time tracking of ETH deposits
- Storage of deposit data in MongoDB
- Telegram notifications for new deposits
- Error handling and logging
- Dockerized for ease of deployment

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) (optional)

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/eth-deposit-tracker.git
   cd eth-deposit-tracker

2.Install dependencies:
  npm install eventsource
  npm install cli-cursor
  npm install web3
  npm install mongoose
  
3.Create a .env file and add your environment variables:
MONGO_URI=mongodb+srv://taruntripathi1907:ltgcCd6RnfCvyzm8@cluster0.wyukd.mongodb.net/eth-deposit-tracker?retryWrites=true&w=majority
TELEGRAM_BOT_TOKEN=7097063806:AAGbux5e07-ziU2hDDz__pod4Ihwd2FuqMg
TELEGRAM_CHAT_ID=5806425999


4. Running the Application
  node event-listener.js

5.Running with Docker
    Build the Docker image:
        docker build -t eth-deposit-tracker .

    Run the container:
        docker run -d -e MONGO_URI=mongodb://your_mongodb_uri -e TELEGRAM_BOT_TOKEN=your_telegram_bot_token -e TELEGRAM_CHAT_ID=your_telegram_chat_id eth-deposit-tracker

6.Testing
    Test Continuous Monitoring
      Simulate ETH deposit events using Postman, cURL, or the webhook tool you are using.
      Check the MongoDB database to ensure deposits are being stored.
      Verify that you receive notifications in your Telegram chat.
    
    Stop the Application
      To stop the application, run:
      docker stop <container_id>






