import fs from 'fs';
import path from 'path';

const dataUrl = fs.readFileSync(
  path.join(process.cwd(), './output/data-url.txt'),
  'utf-8'
);
let htmlData = fs.readFileSync(
  path.join(process.cwd(), './html/index.html'),
  'utf-8'
);

const regex = /<img [^>]*>/g;
htmlData = htmlData.replace(regex, `<img src="${dataUrl}">`);

fs.writeFileSync(
  path.join(process.cwd(), './output/index.html'),
  htmlData,
  'utf-8'
);
