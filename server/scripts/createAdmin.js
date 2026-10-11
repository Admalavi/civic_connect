import 'dotenv/config';import bcrypt from 'bcryptjs';import mongoose from 'mongoose';import User from '../src/models/User.js';
const[email,password,name='Administrator']=process.argv.slice(2);
if(!email||!password||password.length<8){console.log('Usage: npm run create-admin -- <email> <password (8+ chars)> [name]');process.exit(1)}
await mongoose.connect(process.env.MONGO_URI);
await User.findOneAndUpdate({email:email.toLowerCase()},{name,email,password:await bcrypt.hash(password,10),role:'admin'},{upsert:true,new:true,runValidators:true,setDefaultsOnInsert:true});
console.log('Admin ready:',email);await mongoose.disconnect();
