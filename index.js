import fs from 'fs';
import { createCanvas } from 'canvas';

const csvData = fs.readFileSync('./files/tavern-keep-roster.csv', 'utf-8');


function parseCSV(csvData) {
  const rows = csvData.split('\n').filter((row) => row.trim() !== '');
  return rows.map((row) => row.split(','));
}

function parseCSVtoArray(csvData) {
  const rows = csvData.trim().split('\n').map(row => row.split(','));
  return rows;
}

function renderCSVToCanvas(csvData, canvas) {
  const canvasContext = canvas.getContext('2d');
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.fillStyle = "black";

  const cellPadding = 10;
  const cellHeight = 30;
  const cellWidth = 100;


  csvData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      canvasContext.strokeRect(colIndex * cellWidth, rowIndex * cellHeight, cellWidth, cellHeight);
      canvasContext.fillText(cell, colIndex * cellWidth + cellPadding, (rowIndex + 0.7) * cellHeight);
    });
  });
}

function renderCSVToCanvasColWidth(rows, canvas) {
  const context = canvas.getContext('2d');
  context.font = '16px Arial';

  const colWidths = rows[0].map((_, colIndex) => 
    Math.max(...rows.map(row => context.measureText(row[colIndex]).width))
  );

  let y = 20;  // Starting Y position
  rows.forEach(row => {
    let x = 0;  // Starting X position for each row
    row.forEach((cell, colIndex) => {
      context.fillText(cell, x, y);
      x += colWidths[colIndex] + 10;  // Move X by the column width + some padding
    });
    y += 20;  // Move to the next line (adjust as needed for cell height)
  });
}

const canvas = createCanvas(900, 900);
renderCSVToCanvasColWidth(parseCSVtoArray(csvData), canvas);

const dataURL = canvas.toDataURL();
console.log(dataURL);
