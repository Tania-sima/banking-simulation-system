require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

// Define Simple User/Account Schema
const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolder: { type: String, required: true },
  pin: { type: String, required: true },
  bankBalance: { type: Number, default: 10000000 },
  walletBalance: { type: Number, default: 250000 },
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  accountNumber: String,
  title: String,
  amount: Number,
  type: String, // 'Income' or 'Expend'
  source: String,
  date: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', AccountSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'banking_production' });
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear previous data
    await Account.deleteMany({});
    await Transaction.deleteMany({});

    // Create Initial Account
    const primaryAccount = await Account.create({
      accountNumber: '6789',
      accountHolder: 'Demo User',
      pin: '1234',
      bankBalance: 10750000,
      walletBalance: 250000
    });

    // Create Sample Historical Transactions
    await Transaction.create([
      { accountNumber: '6789', title: 'Global Ventures Ltd', amount: 6000000, type: 'Income', source: 'Bank Account' },
      { accountNumber: '6789', title: 'Michael Liu', amount: 300000, type: 'Expend', source: 'Virtual Wallet' },
      { accountNumber: '6789', title: 'Mary Moore', amount: 450000, type: 'Expend', source: 'Virtual Wallet' }
    ]);

    console.log('Database seeded successfully with initial account and transactions!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();