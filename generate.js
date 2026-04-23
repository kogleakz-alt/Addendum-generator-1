const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, UnderlineType, VerticalAlign } = require('docx');

const FONT = 'Times New Roman';
const SZ = 22; // 11pt

// No borders
function noBrd() {
  const n = { style: BorderStyle.NIL };
  return { top: n, bottom: n, left: n, right: n };
}

// Standard cell
function mkCell(paragraphs, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: noBrd(),
    margins: { top: 0, bottom: 0, left: 108, right: 108 },
    children: paragraphs,
  });
}

// Spacer cell
function spacer() {
  return mkCell([mkPara('')], 345);
}

// Standard paragraph
function mkPara(text, opts = {}) {
  const lines = (text || '').split('\n');
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 0, after: 40 },
    indent: opts.indentStart ? { start: opts.indentStart } :
            opts.indentFirst ? { firstLine: opts.indentFirst } : undefined,
    children: lines.flatMap((line, i) => [
      ...(i > 0 ? [new TextRun({ break: 1 })] : []),
      new TextRun({
        text: line,
        font: FONT,
        size: SZ,
        bold: opts.bold || false,
        underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
      }),
    ]),
  });
}

// Section header paragraph: "N." normal + " LABEL" underlined
function secPara(num, label, indentStart) {
  return new Paragraph({
    spacing: { before: 0, after: 40 },
    indent: indentStart ? { start: indentStart } : undefined,
    children: [
      new TextRun({ text: `${num}.`, font: FONT, size: SZ }),
      new TextRun({ text: ` ${label}`, font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
    ],
  });
}

function buildTable(d) {
  const rows = [];

  function addRow(enParas, ruParas) {
    rows.push(new TableRow({
      children: [mkCell(enParas, 4381), spacer(), mkCell(ruParas, 4562)],
    }));
  }

  const num = d.num || '?';
  const contract = d.contract || '';
  const dateContract = d.date_contract || '';
  const date = d.date || '';

  // ── Title row ───────────────────────────────────────────────
  addRow(
    [
      mkPara(`      ADDENDUM №${num} TO CONTRACT `, { bold: true }),
      mkPara(`       № ${contract}`, { bold: true }),
      mkPara(` dated ${dateContract}`, { bold: true, center: true }),
    ],
    [
      mkPara(`ПРИЛОЖЕНИЕ №${num} К КОНТРАКТУ `, { bold: true, center: true }),
      mkPara(`№ ${contract} от ${dateContract}`, { bold: true, center: true }),
    ]
  );

  // ── Date row ────────────────────────────────────────────────
  addRow(
    [mkPara(''), mkPara(`Date: ${date}`, { indentFirst: 180 })],
    [mkPara(''), mkPara(`Дата: ${date}`, { indentFirst: 134 }), mkPara('')]
  );

  // ── 1. GOODS ────────────────────────────────────────────────
  addRow(
    [secPara('1', 'GOODS', 360)],
    [secPara('1', 'ТОВАР', 314)]
  );

  const goodsEN = [mkPara(d.goods_en || '')];
  if (d.lot) goodsEN.push(mkPara(d.lot));
  goodsEN.push(mkPara(d.origin_en || ''));
  const goodsRU = [mkPara(d.goods_ru || ''), mkPara(d.origin_ru || ''), mkPara('')];
  addRow(goodsEN, goodsRU);

  // ── 2. QUANTITY ─────────────────────────────────────────────
  addRow([secPara('2', 'QUANTITY', 360)], [secPara('2', 'КОЛИЧЕСТВО', 360)]);
  addRow([mkPara(d.qty_en || ''), mkPara('')], [mkPara(d.qty_ru || ''), mkPara('')]);

  // ── 3+4+5 combined (matching original structure) ────────────
  const enCol = [
    mkPara(''),
    secPara('3', 'PRICE ', 360),
    mkPara(d.price_en || ''),
    mkPara(d.incoterm || ''),
    mkPara(''),
    mkPara('    '),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '     ', font: FONT, size: SZ }),
        new TextRun({ text: '4. ', font: FONT, size: SZ }),
        new TextRun({ text: 'TOTAL VALUE', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    mkPara(`    ${d.total_en || ''}  `),
    mkPara(''),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '    ', font: FONT, size: SZ }),
        new TextRun({ text: '5. ', font: FONT, size: SZ }),
        new TextRun({ text: 'PAYMENT TERMS', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    mkPara(d.payment_en || ''),
    mkPara(''),
  ];

  const ruCol = [
    mkPara(''),
    secPara('3', 'ЦЕНА ', 360),
    mkPara(d.price_ru || ''),
    mkPara(d.incoterm || ''),
    mkPara(''),
    mkPara(''),
    mkPara(''),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '     ', font: FONT, size: SZ }),
        new TextRun({ text: '4. ', font: FONT, size: SZ }),
        new TextRun({ text: 'ОБЩАЯ СТОИМОСТЬ', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    mkPara(`  ${d.total_ru || ''}`),
    mkPara(' '),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '    ', font: FONT, size: SZ }),
        new TextRun({ text: '5. ', font: FONT, size: SZ }),
        new TextRun({ text: 'УСЛОВИЯ ОПЛАТЫ', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    mkPara(d.payment_ru || ''),
  ];

  addRow(enCol, ruCol);

  // ── 6. PACKAGING ────────────────────────────────────────────
  addRow(
    [mkPara(' 6.  PACKAGING', { indentStart: 360 })],
    [mkPara(' 6. УПАКОВКА', { indentStart: 360 })]
  );
  addRow(
    [mkPara(` ${d.pack_en || ''}`)],
    [mkPara(`${d.pack_ru || ''}   `), mkPara('')]
  );

  // ── 7. DELIVERY ─────────────────────────────────────────────
  const delivEN = [
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '7.', font: FONT, size: SZ }),
        new TextRun({ text: ' DELIVERY PERIOD and TERMS', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    ...(d.delivery_en || '').split('\n').map(l => mkPara(l)),
    mkPara(''),
  ];
  const delivRU = [
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: '    ', font: FONT, size: SZ }),
        new TextRun({ text: '7. ', font: FONT, size: SZ }),
        new TextRun({ text: 'СРОК и УСЛОВИЯ ПОСТАВКИ', font: FONT, size: SZ, underline: { type: UnderlineType.SINGLE } }),
      ],
    }),
    ...(d.delivery_ru || '').split('\n').map(l => mkPara(l)),
    mkPara(''),
  ];
  addRow(delivEN, delivRU);

  // ── Spacer row ───────────────────────────────────────────────
  addRow([mkPara('    '), mkPara('')], [mkPara('')]);

  return new Table({
    width: { size: 9288, type: WidthType.DXA },
    columnWidths: [4381, 345, 4562],
    rows,
  });
}

function sigPara(text, bold, center, indentStart, indentFirst) {
  return new Paragraph({
    alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: 0, after: 0 },
    indent: indentStart ? { start: indentStart, ...(indentFirst ? { firstLine: indentFirst } : {}) } : undefined,
    children: text ? [new TextRun({ text, font: FONT, size: SZ, bold: bold || false })] : [],
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const d = JSON.parse(event.body);
    const table = buildTable(d);

    const sellerSig = d.seller_sig || 'Dinara Apiyeva / Динара Апиева';
    const sellerTitle = d.seller_title || 'Director / Директор';
    const buyerSig = d.buyer_sig || '';
    const buyerTitle = d.buyer_title || 'Director / Генеральный директор';

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 776, right: 851, bottom: 776, left: 1701 },
          },
        },
        children: [
          table,
          sigPara('ПОДПИСИ СТОРОН / SIGNATURES', true, true),
          sigPara(''),
          sigPara('ПРОДАВЕЦ / SELLER', true, true),
          sigPara(''), sigPara(''),
          sigPara('____________________________________                              SP/МП', false, false, 2160),
          sigPara(`[signature/подпись // ${sellerSig}]`, false, false, 1416, 708),
          sigPara(`          ${sellerTitle}  `, false, false, 1416, 708),
          sigPara(''),
          sigPara('ПОКУПАТЕЛЬ / BUYER', true, true),
          sigPara(''), sigPara(''),
          sigPara('____________________________________                              SP/МП', false, false, 720, 720),
          sigPara(`[signature/подпись // ${buyerSig}]`, false, false, 1416, 708),
          sigPara(`              Director / Генеральный директор`, false, false, 2124, 708),
          sigPara(' '),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const num = d.num || 'X';
    const contract = (d.contract || '').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Addendum_N${num}_${contract}.docx"`,
        'Access-Control-Allow-Origin': '*',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
