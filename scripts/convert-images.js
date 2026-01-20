const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'Parallax Video SCROLL');
const DESKTOP_DIR = path.join(__dirname, '..', 'public', 'assets', 'sequence', 'desktop');
const MOBILE_DIR = path.join(__dirname, '..', 'public', 'assets', 'sequence', 'mobile');

// Ensure output directories exist
[DESKTOP_DIR, MOBILE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function convertImages() {
  console.log('Starting image conversion...');
  console.log(`Source: ${SOURCE_DIR}`);

  // Get all JPG files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  console.log(`Found ${files.length} JPG files`);

  let desktopCount = 0;
  let mobileCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourcePath = path.join(SOURCE_DIR, file);
    const frameNum = String(i + 1).padStart(3, '0');

    // Desktop: Convert all 240 frames to WebP at original resolution
    const desktopPath = path.join(DESKTOP_DIR, `frame-${frameNum}.webp`);
    await sharp(sourcePath)
      .webp({ quality: 85 })
      .toFile(desktopPath);
    desktopCount++;

    // Mobile: Convert every 2nd frame (120 total) at 960x540
    if ((i + 1) % 2 === 1) { // Odd frames: 1, 3, 5, ... -> becomes 1, 2, 3, ...
      const mobileFrameNum = String(Math.ceil((i + 1) / 2)).padStart(3, '0');
      const mobilePath = path.join(MOBILE_DIR, `frame-${mobileFrameNum}.webp`);
      await sharp(sourcePath)
        .resize(960, 540, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(mobilePath);
      mobileCount++;
    }

    // Progress indicator
    if ((i + 1) % 20 === 0 || i === files.length - 1) {
      console.log(`Processed ${i + 1}/${files.length} files (Desktop: ${desktopCount}, Mobile: ${mobileCount})`);
    }
  }

  console.log('\nConversion complete!');
  console.log(`Desktop frames: ${desktopCount} (${DESKTOP_DIR})`);
  console.log(`Mobile frames: ${mobileCount} (${MOBILE_DIR})`);
}

convertImages().catch(console.error);
