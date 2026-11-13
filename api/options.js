import { choices, palettes, presets } from '../src/avatar.js';
export default function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Cache-Control','public, max-age=3600');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 return res.status(200).json({choices,palettes,presets});
}