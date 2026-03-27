 🛡️ TruvaPay: Secure Escrow for Everyone
The most secure way to trade in Nigeria. Developed for the Enyata × Interswitch Buildathon 2026.

🚀 Quick Links
🌐 Live Website: https://dami-ann.github.io/truvapay/index.html

🔗 Backend API Repo: https://github.com/Dami-Ann/truvapay_backend

📡 Live API (Render): https://truvapay-api.onrender.com

🔑 Team Code: [79da13]

📖 Project Overview
TruvaPay is a secure escrow-based payment platform designed to protect freelancers, SMEs, and online buyers from payment fraud. We allow sellers to generate a secure Deal Link where funds are held safely until the buyer confirms delivery.

The Problem
Many online transactions in Nigeria happen through informal channels like WhatsApp and Instagram. These lack protection, leading to:

Buyers losing money to "scam" vendors.

Sellers delivering work but never getting paid.

A general lack of trust in social commerce.

The Solution
TruvaPay acts as a trusted middleman. By integrating the Interswitch API, we ensure that money only moves when both parties have fulfilled their promise.

⚙️ Core Features (MVP)
Secure Deal Link Generation: Sellers create custom links for specific transactions.

Escrow Payment Holding: Funds are locked via Interswitch until delivery.

Delivery Tracking: Sellers submit proof of delivery directly through the platform.

Buyer Protection: Buyers can approve the release of funds or Open a Dispute if terms aren't met.

Dynamic Dashboard: Real-time tracking of deal status (Pending, Funded, Delivered).

🛠️ Technical Stack
Frontend: HTML5, CSS3, JavaScript (Vanilla)

Backend: Node.js, Express.js

Database: MongoDB Atlas

Payment Gateway: Interswitch API Integration

Deployment: GitHub Pages (Frontend) & Render (Backend)

🧪 Submission Note for Judges
Note on Payment Testing: The platform is fully integrated with the Interswitch API. Due to current instabilities with the provided test credentials (as noted in the Buildathon communications), some payment attempts may return a "Failed" status. However, the internal Escrow logic and UI state changes for Delivery and Dispute are fully implemented and ready for live environment deployment.

👥 The Team
Dami-Ann (Lead Developer): Frontend & Backend Integration

Team Members: Cybersecurity Engineer, Product Designer, Product Manager
