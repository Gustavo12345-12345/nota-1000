const fs = require('fs');
const path = require('path');

// Generate 32x32 ICO file with "1000" in blue
const WIDTH = 32;
const HEIGHT = 32;

// 32-bit BGRA buffer (32 * 32 * 4 bytes)
const pixelData = Buffer.alloc(WIDTH * HEIGHT * 4, 0);

// Helper to set pixel (x, y) with (r, g, b, a)
// Note: BMP stores rows bottom-to-top!
function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const bmpY = HEIGHT - 1 - y; // invert Y for bottom-up BMP
  const offset = (bmpY * WIDTH + x) * 4;
  pixelData[offset] = b;     // B
  pixelData[offset + 1] = g; // G
  pixelData[offset + 2] = r; // R
  pixelData[offset + 3] = a; // A
}

// Draw a simple 5x7 or 6x9 pixel font for "1000"
// Character bitmaps for '1', '0' (each 5 wide, 9 tall)
const font1 = [
  "  #  ",
  " ##  ",
  "# #  ",
  "  #  ",
  "  #  ",
  "  #  ",
  "  #  ",
  "  #  ",
  "#####",
];

const font0 = [
  " ### ",
  "#   #",
  "#   #",
  "#   #",
  "#   #",
  "#   #",
  "#   #",
  "#   #",
  " ### ",
];

const glyphs = [font1, font0, font0, font0];
const startX = 2; // fits 4 glyphs * 6px + spacing = ~26px wide
const startY = 11; // center vertically in 32px height (9 tall -> 11 to 20)

// Blue color #2563eb -> r: 37, g: 99, b: 235
const BLUE_R = 37;
const BLUE_G = 99;
const BLUE_B = 235;

glyphs.forEach((glyph, gIdx) => {
  const gx = startX + gIdx * 7;
  for (let r = 0; r < glyph.length; r++) {
    for (let c = 0; c < glyph[r].length; c++) {
      if (glyph[r][c] === '#') {
        setPixel(gx + c, startY + r, BLUE_R, BLUE_G, BLUE_B, 255);
      }
    }
  }
});

// Create BMP header (BITMAPINFOHEADER)
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40, 0);         // biSize
bih.writeInt32LE(WIDTH, 4);       // biWidth
bih.writeInt32LE(HEIGHT * 2, 8);  // biHeight (doubled for ICO mask)
bih.writeUInt16LE(1, 12);         // biPlanes
bih.writeUInt16LE(32, 14);        // biBitCount
bih.writeUInt32LE(0, 16);         // biCompression (BI_RGB)
bih.writeUInt32LE(WIDTH * HEIGHT * 4, 20); // biSizeImage

// 1-bit AND mask (32 rows * 4 bytes per row = 128 bytes, all 0 = opaque)
const andMask = Buffer.alloc((WIDTH / 8) * HEIGHT, 0);

// Image data block
const imgData = Buffer.concat([bih, pixelData, andMask]);

// ICO Header
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type 1 = ICO
icoHeader.writeUInt16LE(1, 4); // 1 image

// ICO Directory Entry
const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(WIDTH, 0);            // width
icoEntry.writeUInt8(HEIGHT, 1);           // height
icoEntry.writeUInt8(0, 2);                // colors
icoEntry.writeUInt8(0, 3);                // reserved
icoEntry.writeUInt16LE(1, 4);             // planes
icoEntry.writeUInt16LE(32, 6);            // bpp
icoEntry.writeUInt32LE(imgData.length, 8);// image size
icoEntry.writeUInt32LE(22, 12);           // offset (6 + 16 = 22)

const finalIco = Buffer.concat([icoHeader, icoEntry, imgData]);

// Write to public/favicon.ico and src/app/favicon.ico
const publicPath = path.join(__dirname, '..', 'public', 'favicon.ico');
const appPath = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');

fs.writeFileSync(publicPath, finalIco);
fs.writeFileSync(appPath, finalIco);
console.log('Successfully generated favicon.ico at:', publicPath, 'and', appPath);
