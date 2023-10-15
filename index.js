import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const csvData = fs.readFileSync('./files/tavern-keep-roster.csv', 'utf-8');
const rowHeight = 25;
const columnsToRemove = ['Alias 1', 'Alias 2', 'Full Name'];

function parseCSVtoArray(csvData, columnsToRemove) {
  let rows = csvData
    .trim()
    .split('\n')
    .map((row) => row.split(','));

  if (columnsToRemove) {
    const indicesToRemove = rows[0]
      .map((colName, index) =>
        columnsToRemove.includes(colName) ? index : undefined
      )
      .filter((index) => index);

    rows = rows.map((row) =>
      row.filter((_, index) => !indicesToRemove.includes(index))
    );
  }

  return rows;
}

function drawHorizontalLines(rows, context, colWidths) {
  let y = 20; // Starting Y position
  let finalX = 0;
  rows.forEach((row, rowIndex) => {
    let x = 0;
    row.forEach((cell, colIndex) => {
      // Draw cell text
      context.fillText(cell, x + 5, y + rowHeight / 2 + 5);
      x += colWidths[colIndex] + 10;
    });

    // Draw horizontal lines after every row
    context.moveTo(0, y);
    context.lineTo(x, y);
    context.stroke();

    y += rowHeight;
    finalX = x;
  });

  //draw the final horizontal line
  context.moveTo(0, y);
  context.lineTo(finalX, y);
  context.stroke();

  return y;
}

function drawVerticalLines(context, colWidths, y) {
  // Draw vertical lines
  let x = 0;
  colWidths.forEach((width) => {
    context.moveTo(x, 20 - rowHeight + 24); // Assuming 20 is starting Y as in previous example
    context.lineTo(x, y); // 'y' is now at the bottom of the table after all rows
    context.stroke();
    x += width + 10;
  });

  // Draw the final vertical line for the table's rightmost boundary
  context.moveTo(x, 20 - rowHeight + 24);
  context.lineTo(x, y);
  context.stroke();
}

function renderCSVToCanvasPredictiveColWidth(rows, canvas) {
  const context = canvas.getContext('2d');
  context.font = '16px Arial';
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';

  //we need to get the maximum column widths so we can set the cell width
  //to the largest colWidth in the column.
  const colWidths = rows[0].map((_, colIndex) =>
    Math.max(...rows.map((row) => context.measureText(row[colIndex]).width))
  );

  let y = drawHorizontalLines(rows, context, colWidths);
  drawVerticalLines(context, colWidths, y);
}

function createPNGFileFromCanvas(canvas) {
  const out = fs.createWriteStream(path.join(process.cwd(), 'output/test.png'));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
}

const canvas = createCanvas(900, 900);
renderCSVToCanvasPredictiveColWidth(parseCSVtoArray(csvData, columnsToRemove), canvas);
createPNGFileFromCanvas(canvas);

const dataURL = canvas.toDataURL();
console.log(dataURL);
