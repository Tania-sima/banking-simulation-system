const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bank_sim_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Schemas & Models (Matching Proposal ERD) ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nid: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  isApproved: { type: Boolean, default: true },
  bankBalance: { type: Number, default: 125500.00 },
  walletBalance: { type: Number, default: 25000.00 },
  accountNumber: { type: String, default: '6789' }
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true }, // 'Send Money', 'Add Money', 'Cash Out', 'Utility Bill'
  accountSource: { type: String, required: true }, // 'Bank Account' or 'Virtual Wallet'
  amount: { type: Number, required: true },
  recipient: { type: String, required: true },
  status: { type: String, default: 'Completed' },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// --- REST API Endpoints ---

// 1. Get User Profile & Balances
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Execute Transaction (Bank / Wallet / Cash Out / Bill Pay)
app.post('/api/transactions/execute', async (req, res) => {
  const { userId, type, accountSource, amount, recipient } = req.body;
  const numAmount = parseFloat(amount);

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate balance based on source
    if (accountSource === 'Bank Account' && user.bankBalance < numAmount) {
      return res.status(400).json({ error: 'Insufficient Bank Account funds' });
    }
    if (accountSource === 'Virtual Wallet' && user.walletBalance < numAmount) {
      return res.status(400).json({ error: 'Insufficient Wallet balance' });
    }

    // Process balances
    if (type === 'Add Money') {
      // Transfer from Bank to Wallet
      user.bankBalance -= numAmount;
      user.walletBalance += numAmount;
    } else if (accountSource === 'Bank Account') {
      user.bankBalance -= numAmount;
    } else if (accountSource === 'Virtual Wallet') {
      user.walletBalance -= numAmount;
    }

    await user.save();

    const transaction = new Transaction({
      userId,
      type,
      accountSource,
      amount: numAmount,
      recipient,
      status: 'Completed'
    });
    await transaction.save();

    res.json({ message: 'Transaction successful', bankBalance: user.bankBalance, walletBalance: user.walletBalance, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Fetch Transaction History
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 }).limit(10);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Admin Analytics / Fraud Monitor
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const transactions = await Transaction.find().sort({ date: -1 });
    const fraudAlerts = transactions.filter(t => t.amount > 100000); // Flag simulated high-risk transactions
    res.json({ totalUsers, transactions, fraudAlerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Simulation Backend running on port ${PORT}`));