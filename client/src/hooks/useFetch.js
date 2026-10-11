import {useEffect,useState} from 'react';import api,{errMsg} from '../services/api';
export default function useFetch(url,params){const[data,setD]=useState(null);const[loading,setL]=useState(true);const[err,setE]=useState('');const k=JSON.stringify(params);
 useEffect(()=>{setL(true);api.get(url,{params}).then(r=>{setD(r.data);setE('')}).catch(e=>setE(errMsg(e))).finally(()=>setL(false))},[url,k]);return{data,loading,err}}
