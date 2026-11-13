import sharp from 'sharp';
import { generateOptions, renderAvatar } from '../src/avatar.js';
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(!['GET','HEAD'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
  try{
    const format=req.query?.format==='png'||(req.url||'').split('?')[0].endsWith('.png')?'png':'svg';
    const size=Number(req.query?.size??512);
    if(!Number.isSafeInteger(size)||size<32||size>2048)return res.status(400).json({error:'size must be an integer from 32 to 2048'});
    const opts=generateOptions(req.query?.seed,req.query||{});
    const svg=renderAvatar(opts);
    res.setHeader('Cache-Control','public, max-age=3600, s-maxage=86400');
    if(format==='svg'){
      res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
      return res.status(200).send(req.method==='HEAD'?'':svg);
    }
    res.setHeader('Content-Type','image/png');
    if(req.method==='HEAD')return res.status(200).end();
    const png=await sharp(Buffer.from(svg)).resize(size,size).png({compressionLevel:9}).toBuffer();
    return res.status(200).send(png);
  }catch(e){console.error(e);return res.status(500).json({error:'Avatar generation failed'})}
}