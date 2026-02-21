import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const masterIconPath = path.resolve('public/master-icon.png');

  if (!fs.existsSync(masterIconPath)) {
    console.error('Master icon not found at public/master-icon.png');
    process.exit(1);
  }

  const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'favicon.ico', size: 32, format: 'ico' }
  ];

  for (const icon of sizes) {
    const outputPath = path.resolve(`public/${icon.name}`);
    console.log(`Generating ${icon.name}...`);

    let pipeline = sharp(masterIconPath).resize(icon.size, icon.size);

    if (icon.format === 'ico') {
      await pipeline.toFormat('png').toFile(outputPath.replace('.ico', '.png')); // Intermediate for ico if needed, but sharp can do ico via specific plugins or just save as png and rename for modern browsers.
      // Actually sharp doesn't fully support .ico out of the box easily without plugins for multi-size.
      // For this script, we'll save a 32x32 png as favicon.ico which works in most modern contexts or use a simple resizing.
      // Let's stick to png for favicon.ico for simplicity as modern browsers support it, or just use favicon.png.
      // Standard practice: save as favicon.ico (most tools handle png content in ico file or we just use png).
      // Let's generate a 32x32 PNG and name it favicon.ico for now, or better yet, just keep it as favicon.ico but write png buffer.
       await pipeline.toFile(outputPath);
    } else {
      await pipeline.toFile(outputPath);
    }
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
