import {Router} from 'express';import Complaint from '../models/Complaint.js';import {protect,w} from '../middleware/auth.js';
const r=Router();
r.get('/',protect,w(async(q,s)=>{const match=q.user.role==='admin'&&q.query.scope!=='me'?{}:{citizen:q.user._id};
 const[a]=await Complaint.aggregate([{$match:match},{$facet:{st:[{$group:{_id:'$status',n:{$sum:1}}}],cat:[{$group:{_id:'$category',n:{$sum:1}}},{$sort:{n:-1}}],day:[{$group:{_id:{$dateToString:{format:'%Y-%m-%d',date:'$createdAt'}},n:{$sum:1}}},{$sort:{_id:1}},{$limit:60}]}}]);
 const c=k=>a.st.find(x=>x._id===k)?.n||0;const total=a.st.reduce((t,x)=>t+x.n,0);
 s.json({total,pending:c('Pending'),inProgress:c('In Progress'),resolved:c('Resolved'),resolutionRate:total?Math.round(c('Resolved')/total*100):0,
  byCategory:a.cat.map(x=>({name:x._id,count:x.n})),byDate:a.day.map(x=>({date:x._id,count:x.n})),recent:await Complaint.find(match).select('-citizen -__v').sort({createdAt:-1}).limit(5)})}));
export default r;
