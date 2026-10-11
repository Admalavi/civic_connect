import mongoose from 'mongoose';
import {CATEGORIES,STATUSES} from '../utils/constants.js';
const s=new mongoose.Schema({
 complaintId:{type:String,unique:true,default:()=>'CC-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase()},
 title:{type:String,required:true,trim:true,minlength:5,maxlength:120},
 description:{type:String,required:true,trim:true,minlength:10,maxlength:2000},
 category:{type:String,enum:CATEGORIES,required:true},
 photoUrl:{type:String,default:''},
 location:{type:{type:String,enum:['Point'],default:'Point'},coordinates:{type:[Number],required:true}},
 address:{type:String,trim:true,maxlength:200,default:''},
 status:{type:String,enum:STATUSES,default:'Pending'},
 citizen:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
 statusHistory:[{from:String,to:String,by:{type:mongoose.Schema.Types.ObjectId,ref:'User'},remark:String,at:{type:Date,default:Date.now}}]
},{timestamps:true});
s.index({location:'2dsphere'});s.index({status:1,category:1});
export default mongoose.model('Complaint',s);
