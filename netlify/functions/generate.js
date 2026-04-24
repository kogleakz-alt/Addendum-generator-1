const JSZip = require('jszip');
const TEMPLATE_B64 = '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';

function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&apos;'); }
function rep(x,f,t){ return x.split(esc(f)).join(esc(t)).split(f).join(esc(t)); }

async function fill(d){
  // Load template from embedded base64
  const templateBuf = Buffer.from(TEMPLATE_B64,'base64');
  const zip = await JSZip.loadAsync(templateBuf);
  let x = await zip.file('word/document.xml').async('string');

  const num = String(d.num||'14');
  const date = d.date||'23.03.2026';
  const dc = d.date_contract||'02.07.2025';
  const contract = d.contract||'KAR-MOJ-USD 01/2025';

  // Number
  x = x.replace(
    /(ADDENDUM \u2116<\/w:t><\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)14(<\/w:t>)/,
    '$1'+esc(num)+'$2'
  );
  x = x.replace(/ПРИЛОЖЕНИЕ \u211614 К КОНТРАКТУ /g,'ПРИЛОЖЕНИЕ \u2116'+esc(num)+' К КОНТРАКТУ ');

  // Contract
  const cm = contract.match(/^([^\s]+)\s+(.+)/)||[null,'KAR-MOJ-USD','01/2025'];
  x = rep(x,'KAR-MOJ-USD ',cm[1]+' ');
  x = rep(x,'01/2025',cm[2]);
  x = rep(x,'dated 02','dated '+dc.slice(0,2));
  x = rep(x,'.07.2025',dc.slice(2));
  x = x.replace(new RegExp(esc(cm[2])+'  dd ','g'),esc(cm[2])+'  от ');

  // Date - replace each split run individually
  const dd=date.slice(0,2),mm=date.slice(3,5),yy=date.slice(6,10);
  x = x.replace(/>: 2<\/w:t>/g,'>: '+dd[0]+'</w:t>');
  x = x.replace(/<w:t>3<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)\.(<\/w:t><\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)03/g,
    '<w:t>'+dd[1]+'</w:t>$1.$203'.replace('03',mm));
  x = x.replace(/\.20<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)26<\/w:t>/g,
    '.'+yy.slice(0,2)+'</w:t>$1'+yy.slice(2)+'</w:t>');

  // Goods
  x = rep(x,'Crushed Cocoa Bean Shell',d.goods_en||'');
  x = rep(x,'Country of Origin: Nigeria','Country of Origin: '+(d.origin_en||''));
  x = rep(x,'Какао-велла (шелуха) дробленая',d.goods_ru||'');
  x = rep(x,'Нигерия',d.origin_ru||'');

  // Quantity
  const qty=String(d.qty||'25').split(' ')[0];
  x = x.replace(/>25 <\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)tons net/,'>'+esc(qty)+' </w:t>$1tons net');
  x = x.replace(/>25<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)тонн/,'>'+esc(qty)+'</w:t>$1тонн');

  // Price
  x = rep(x,'1140 USD/MT',d.price_en||'1140 USD/MT');
  x = rep(x,'Saint-Petersburg, Russia',d.incoterm||'Saint-Petersburg, Russia');
  x = rep(x,'1140 USD/т',d.price_ru||'1140 USD/т');
  x = rep(x,'Санкт-Петербург, Россия',d.incoterm_ru||d.incoterm||'');

  // Total — template: "28500" then "USD  " (two separate w:t runs)
  const tn=String(d.total_num||'28500');
  const cur=d.currency||'USD';
  x = x.replace(/>28500<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t xml:space="preserve">)USD  <\/w:t>/,
    '>'+esc(tn)+'</w:t>$1'+esc(cur)+'  </w:t>');
  // RU total: "2850" | "0" | " " | "USD"
  x = x.replace(/>2850<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)0<\/w:t>(<\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t xml:space="preserve"> <\/w:t><\/w:r><w:r[^>]*><w:rPr[\s\S]*?<\/w:rPr><w:t[^>]*>)USD<\/w:t>/,
    '>'+esc(tn.slice(0,-1))+'</w:t>$1'+esc(tn.slice(-1))+'</w:t>$2'+esc(cur)+'</w:t>');

  // Payment
  x = rep(x,'Payment within 4 weeks after invoice date',d.payment_en||'Payment within 4 weeks after invoice date');
  x = rep(x,'Оплата в течение 4 недель с момента выставления инвойса ',(d.payment_ru||'Оплата в течение 4 недель')+' ');

  // Packaging
  x = rep(x,'25 kg  net bags',d.pack_en||'25 kg net bags');
  x = rep(x,'Мешки по 25 кг нетто   ',(d.pack_ru||'Мешки по 25 кг нетто')+'   ');

  // Delivery
  x = rep(x,'Delivery  in April 2026',d.delivery_en_1||'Delivery in April 2026');
  x = rep(x,'CFR Saint-Petersburg, Russia',d.delivery_en_2||'');
  x = rep(x,'Поставка в апреле 2026 г. ',(d.delivery_ru_1||'')+' ');
  x = rep(x,'CFR Санкт-Петербург, Россия',d.delivery_ru_2||'');

  // Signatures
  x = rep(x,'Dinara',d.seller_first||'Dinara');
  x = rep(x,'Apiyeva',d.seller_last||'Apiyeva');
  x = rep(x,'/ Динара Апиева]','/ '+(d.seller_ru||'Динара Апиева')+']');
  x = rep(x,'A.S. Vazhenin',d.buyer_name||'________________');
  x = rep(x,'А.С. Важенин',d.buyer_ru||'________________');

  zip.file('word/document.xml', x);

  // Generate with proper options to avoid corruption
  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
}

exports.handler = async (event) => {
  if(event.httpMethod==='OPTIONS') return {
    statusCode:200,
    headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'}
  };
  if(event.httpMethod!=='POST') return {statusCode:405,body:'Method not allowed'};

  try{
    const d = JSON.parse(event.body);
    const buf = await fill(d);

    // Verify the output is a valid zip before sending
    await JSZip.loadAsync(buf); // throws if invalid

    const num = String(d.num||'X').replace(/[^a-zA-Z0-9]/g,'_').slice(0,10);
    const con = (d.contract||'').replace(/[^a-zA-Z0-9]/g,'_').slice(0,20);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Addendum_N${num}_${con}.docx"`,
        'Access-Control-Allow-Origin': '*',
      },
      body: buf.toString('base64'),
      isBase64Encoded: true,
    };
  } catch(err){
    console.error('Error:', err.message);
    return {statusCode:500, body: JSON.stringify({error: err.message})};
  }
};
