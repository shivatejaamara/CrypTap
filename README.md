# 💸 CrypTap 💸
Welcome to the engine that makes CrypTap run 🚀 our platform that turns your crypto into spendable INR, instantly.

Imagine this: You’re at your favorite coffee shop ☕. You scan their UPI QR code, choose to pay in crypto, and within seconds, the shop owner gets INR in their account ,no complicated exchange transfers, no waiting for banks, and no explaining crypto to them. That’s the magic CrypTap delivers.
# 🛠 Behind the Scenes — Tech We Use
- Node.js + Express.js – Core backend framework

- Axios – Talking to APIs

- dotenv – Securely storing API keys & secrets

- MERN stack frontend – Where you connect wallets & scan QR codes

- MetaMask / WalletConnect – Wallet integrations

- Polygon (Mumbai Testnet) – Blockchain settlement layer

- CoinGecko API – Real-time crypto-to-INR rates

- Firebase – User authentication, DB, analytics

- QR Code Scanner – For scanning merchant UPI codes

- Mock UPI Layer – For payment testing without touching real banks
# 🚀 What This Backend Does
 - 🔐 Runs on a secure, lightweight Express server

- 🛠 Accepts crypto payment requests from the frontend (React/Next.js)

- 🔄 Works with Transak (and supports Onmeta) to swap crypto → INR

- 📡 Sends INR to any UPI ID in real-time

- 💹 Fetches live INR conversion rates so you know exactly what you’re paying

- 📜 Keeps a transaction history for your records

- 🛒 Works for groceries, bills, online orders, restaurants — you name it



## 📂 Project Structure

server/
│
├── index.js        # Main entry point
├── routes/
│   └── offramp.js  # POST endpoint for crypto-to-INR
├── .env            # API keys (keep this secret)
└── package.json

# ⚙️ Getting Started
1️⃣ Clone the repo

bash
Copy
Edit
git clone https://github.com/shivatejaamara/CrypTap.git
cd CrypTap
----
2️⃣ Install dependencies


npm install
----
3️⃣ Set up environment variables
Create a .env file:


TRANSAK_API_KEY=your_transak_key
TRANSAK_SECRET=your_transak_secret
BASE_URL=https://api.transak.com
PORT=8000
---
4️⃣ Run the server

npx nodemon index.js
---
# 🧪 Testing with Postman
Method: POST

URL: http://localhost:8000/api/offramp
---

Body:

json

{
  "amount": 1000,
  "upiId": "example@upi",
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}

Response: JSON with payment success or error details.
---

# 💡 Why CrypTap Is a Game-Changer
- No merchant crypto knowledge needed – They just get INR

- No long waits – Transactions settle in seconds

- No extra steps – No exchange withdrawals, no bank hassles

- Works anywhere UPI works – Which is basically everywhere in India

- Crystal clear rates – No hidden fees, no confusion

# 🔗 Project Builder: Amara Shivateja
