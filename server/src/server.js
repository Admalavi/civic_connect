import app from './app.js';import mongoose from 'mongoose';
if(!process.env.JWT_SECRET||!process.env.MONGO_URI){console.error('Missing MONGO_URI or JWT_SECRET. Copy server/.env.example to server/.env');process.exit(1)}
mongoose.connect(process.env.MONGO_URI).then(async()=>{await mongoose.model('Complaint').init();app.listen(process.env.PORT||5000,()=>console.log('API on port '+(process.env.PORT||5000)))}).catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1)});
import './models/Complaint.js';
