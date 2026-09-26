const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection targeting banking_production
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/banking_production';
mongoose.connect(MONGO_URI, { dbName: 'banking_production' })
  .then(() => console.log('MongoDB Connected Successfully to banking_production'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Schemas & Models ---
const UserSchema = new mongoose.Schema({
  name: { type: String, default: 'Tania Akter' },
  email: { type: String, default: 'tania@bankingsim.com' },
  phone: { type: String, default: '01700000000' },
  nid: { type: String, default: '1234567890' },
  password: { type: String, default: '1234' },
  pin: { type: String, default: '1234' },
  role: { type: String, default: 'user' },
  isApproved: { type: Boolean, default: true },
  bankBalance: { type: Number, default: 10750000 },
  walletBalance: { type: Number, default: 250000 },
  accountNumber: { type: String, default: '6789', unique: true }
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // 'Income' or 'Expend'
  category: { type: String, default: 'Transfer' },
  source: { type: String, required: true }, // 'Bank Account' or 'Virtual Wallet'
  amount: { type: Number, required: true },
  recipient: { type: String, required: true },
  status: { type: String, default: 'Completed' },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Helper function to get or initialize default user 6789
async function getOrCreateUser(accNum = '6789') {
  let user = await User.findOne({ accountNumber: accNum });
  if (!user) {
    user = await User.create({
      name: 'Tania Akter',
      email: 'tania@bankingsim.com',
      phone: '01700000000',
      nid: '1234567890',
      password: '1234',
      pin: '1234',
      bankBalance: 10750000,
      walletBalance: 250000,
      accountNumber: accNum
    });
    // Add default initial transactions
    await Transaction.insertMany([
      { accountNumber: accNum, title: 'Global Ventures Ltd', type: 'Income', source: 'Bank Account', amount: 6000000, recipient: 'Self' },
      { accountNumber: accNum, title: 'Michael Liu', type: 'Expend', source: 'Virtual Wallet', amount: 300000, recipient: 'Michael Liu' },
      { accountNumber: accNum, title: 'Mary Moore', type: 'Expend', source: 'Virtual Wallet', amount: 450000, recipient: 'Mary Moore' }
    ]);
  }
  return user;
}

// --- REST API Endpoints ---

// 1. Get Account Profile & Balances by Account Number
app.get('/api/account/:accountNumber', async (req, res) => {
  try {
    const user = await getOrCreateUser(req.params.accountNumber);
    res.json({
      accountHolder: user.name,
      accountNumber: user.accountNumber,
      bankBalance: user.bankBalance,
      walletBalance: user.walletBalance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Fetch Transaction History by Account Number
app.get('/api/transactions/:accountNumber', async (req, res) => {
  try {
    const accNum = req.params.accountNumber;
    await getOrCreateUser(accNum);
    const transactions = await Transaction.find({ accountNumber: accNum }).sort({ date: -1 }).limit(20);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Centralized Transaction Execution (Handles Send, Add, Cash Out, Recharge, Bills)
app.post('/api/transactions/execute', async (req, res) => {
  const { accountNumber = '6789', type, accountSource, amount, recipientIdentifier, pin } = req.body;
  const numAmount = parseFloat(amount);

  try {
    const user = await getOrCreateUser(accountNumber);

    // Validate PIN
    if (pin && user.pin !== pin) {
      return res.status(400).json({ message: 'Incorrect Security PIN. Default is 1234.' });
    }

    let txType = 'Expend';
    let txTitle = recipientIdentifier || type;

    if (type === 'Add Money') {
      // Transfer from Bank Account to Virtual Wallet
      if (user.bankBalance < numAmount) {
        return res.status(400).json({ message: 'Insufficient Bank Account funds.' });
      }
      user.bankBalance -= numAmount;
      user.walletBalance += numAmount;
      txType = 'Income';
      txTitle = 'Bank to Wallet Top-Up';
    } else if (accountSource === 'Bank Account') {
      if (user.bankBalance < numAmount) {
        return res.status(400).json({ message: 'Insufficient Bank Account funds.' });
      }
      user.bankBalance -= numAmount;
    } else if (accountSource === 'Virtual Wallet') {
      if (user.walletBalance < numAmount) {
        return res.status(400).json({ message: 'Insufficient Virtual Wallet funds.' });
      }
      user.walletBalance -= numAmount;
    }

    await user.save();

    // Create & log the new transaction record
    const transaction = await Transaction.create({
      accountNumber: user.accountNumber,
      title: txTitle,
      type: txType,
      source: accountSource,
      amount: numAmount,
      recipient: recipientIdentifier || 'N/A',
      status: 'Completed'
    });

    res.json({
      message: 'Transaction completed successfully',
      bankBalance: user.bankBalance,
      walletBalance: user.walletBalance,
      transaction
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Admin Analytics Endpoint
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const transactions = await Transaction.find().sort({ date: -1 });
    const fraudAlerts = transactions.filter(t => t.amount > 1000000);
    res.json({ totalUsers, transactions, fraudAlerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Simulation Backend running on port ${PORT}`));