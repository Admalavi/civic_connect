import jwt from 'jsonwebtoken';import User from '../models/User.js';
export const protect=async(req,res,next)=>{try{const t=(req.headers.authorization||'').replace('Bearer ','');const d=jwt.verify(t,process.env.JWT_SECRET);req.user=await User.findById(d.id);if(!req.user)throw 0;next()}catch{res.status(401).json({message:'Not authenticated'})}};
export const adminOnly=(req,res,next)=>req.user?.role==='admin'?next():res.status(403).json({message:'Administrator access required'});
export const httpErr=(status,message)=>Object.assign(new Error(message),{status});
export const w=f=>(q,s,n)=>f(q,s,n).catch(n);
export const errorHandler=(e,req,res,next)=>{let status=e.status||500;if(e.name==='ValidationError'||e.name==='CastError'||e.code==='LIMIT_FILE_SIZE')status=400;if(e.code===11000)status=409;res.status(status).json({message:e.code==='LIMIT_FILE_SIZE'?'Image must be under 5MB':e.message||'Server error'})};
