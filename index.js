import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const columnsToRemove = ["Alias 1", "Alias 2", "Full Name"];
const csvData = fs.readFileSync('./files/tavern-keep-roster.csv', 'utf-8');


function parseCSVtoArray(csvData) {
  const rows = csvData.trim().split('\n').map(row => row.split(','));
  const indicesToRemove = rows[0].map((colName, index) => columnsToRemove.includes(colName) ? index : -1).filter(index => index !== -1);
  const filteredRows = rows.map(row => row.filter((_, index) => !indicesToRemove.includes(index)));
  return filteredRows;
}

function renderCSVToCanvasColWidth(rows, canvas) {
  const rowHeight = 25;
  const context = canvas.getContext('2d');
  context.font = '16px Arial';
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black'

  const colWidths = rows[0].map((_, colIndex) =>
    Math.max(...rows.map(row => context.measureText(row[colIndex]).width))
  );

  const cellPadding = 10;
  const cellHeight = 30;
  const cellWidth = 100;

  // let y = 20;  // Starting Y position
  // rows.forEach(row => {
  //   let x = 0;  // Starting X position for each row
  //   row.forEach((cell, colIndex) => {
  //     context.fillText(cell, x, y);
  //     x += colWidths[colIndex] + 10;  // Move X by the column width + some padding
  //   });
  //   y += 20;  // Move to the next line (adjust as needed for cell height)
  // });


  let y = 20;  // Starting Y position
  rows.forEach((row, rowIndex) => {
    let x = 0;
    row.forEach((cell, colIndex) => {

      // Draw cell text
      context.fillText(cell, x + 5, y + (rowHeight / 2) + 5);

      x += colWidths[colIndex] + 10;
    });

    // Draw horizontal lines after every row
    context.moveTo(0, y);
    context.lineTo(x, y);
    context.stroke();

    y += rowHeight;
  });

  // Draw vertical lines
  let x = 0;
  colWidths.forEach(width => {
    context.moveTo(x, 20 - rowHeight + 8);  // Assuming 20 is starting Y as in previous example
    context.lineTo(x, y);  // 'y' is now at the bottom of the table after all rows
    context.stroke();
    x += width + 10;
  });

  // Draw the final vertical line for the table's rightmost boundary
  context.moveTo(x, 20 - rowHeight + 5);
  context.lineTo(x, y);
  context.stroke();
}

function createPNGFileFromCanvas(canvas) {
  const out = fs.createWriteStream(path.join(process.cwd(), 'output/test.png'));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
}

const canvas = createCanvas(900, 900);
renderCSVToCanvasColWidth(parseCSVtoArray(csvData), canvas);
createPNGFileFromCanvas(canvas);

const dataURL = canvas.toDataURL();
console.log(dataURL);
