import 'dotenv/config';import express from 'express';import cors from 'cors';
import auth from './routes/auth.js';import complaints from './routes/complaints.js';import stats from './routes/stats.js';import {errorHandler} from './middleware/auth.js';
const app=express();app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));
app.get('/api/health',(q,s)=>s.json({ok:true}));app.use('/api/auth',auth);app.use('/api/complaints',complaints);app.use('/api/stats',stats);
app.use((q,s)=>s.status(404).json({message:'Route not found'}));app.use(errorHandler);
export default app;
