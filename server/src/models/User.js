import mongoose from 'mongoose';
const s=new mongoose.Schema({name:{type:String,required:true,trim:true,minlength:2,maxlength:60},email:{type:String,required:true,unique:true,lowercase:true,trim:true,match:/^\S+@\S+\.\S+$/},password:{type:String,required:true,select:false},role:{type:String,enum:['citizen','admin'],default:'citizen'}},{timestamps:true});
export default mongoose.model('User',s);
