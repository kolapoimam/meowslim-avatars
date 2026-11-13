import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { generateOptions, renderAvatar } from '../src/avatar.js';
const items=[['hijab-forest','Amina','female','hijab','#276D5C'],['hijab-rose','Maryam','female','hijab','#C96C63'],['niqab-deep','Zainab','female','niqab','#34475D'],['niqab-lilac','Hafsa','female','niqab','#765A9C'],['burqa-blue','Layla','female','burqa','#397DA0'],['khimar-gold','Fatima','female','khimar','#D4A14F'],['kufi-navy','Yusuf','male','kufi','#34475D'],['kufi-sun','Bilal','male','kufi','#D4A14F'],['turban-cream','Ibrahim','male','turban','#EFE8D6'],['turban-clay','Omar','male','turban','#C96C63'],['tagelmust-sage','Idris','male','tagelmust','#82916A'],['no-cover','Hamza','male','none','#276D5C']];
const out=path.join(process.cwd(),'public','assets');await fs.mkdir(out,{recursive:true});
const manifest=[];
for(const [name,seed,gender,covering,fabricColor] of items){const opt=generateOptions(seed,{gender,covering,fabricColor,transparent:true});const file=name+'.png';await sharp(Buffer.from(renderAvatar(opt))).resize(512,512).png().toFile(path.join(out,file));manifest.push({name,file,seed,gender,covering,fabricColor})}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
console.log('Generated',manifest.length,'PNG avatars');