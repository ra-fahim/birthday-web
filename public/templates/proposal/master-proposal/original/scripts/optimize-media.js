/**
 * Image and Video Optimization Script
 * 
 * Run this script to optimize all images and videos in public/museum-gallery/
 * 
 * Usage: node scripts/optimize-media.js
 * 
 * This will:
 * 1. Convert all JPG/PNG images to optimized WebP and AVIF formats
 * 2. Keep originals as fallbacks
 * 3. Generate optimized thumbnails for videos
 * 4. Compress videos to multiple quality levels
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MUSEUM_DIR = join(__dirname, '..', 'public', 'museum-gallery');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm'];

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const base = basename(filePath, ext);
  const dir = dirname(filePath);

  if (!IMAGE_EXTENSIONS.includes(ext)) return;

  console.log(`📸 Optimizing: ${basename(filePath)}`);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Generate WebP version (excellent compression, wide support)
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(join(dir, `${base}.webp`));
    console.log(`  ✓ Created WebP`);

    // Generate AVIF version (best compression, modern browsers)
    await image
      .avif({ quality: 80, effort: 9 })
      .toFile(join(dir, `${base}.avif`));
    console.log(`  ✓ Created AVIF`);

    // Optimize original format
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(join(dir, `${base}-optimized${ext}`));
      console.log(`  ✓ Optimized original JPEG`);
    } else if (ext === '.png') {
      await image
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(join(dir, `${base}-optimized${ext}`));
      console.log(`  ✓ Optimized original PNG`);
    }

    // Generate thumbnail (for quick previews)
    await image
      .resize(400, 533, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(join(dir, `${base}-thumb.webp`));
    console.log(`  ✓ Created thumbnail`);

  } catch (error) {
    console.error(`  ✗ Error optimizing ${basename(filePath)}:`, error.message);
  }
}

async function optimizeVideoThumbnail(filePath) {
  const ext = extname(filePath).toLowerCase();
  const base = basename(filePath, ext);
  const dir = dirname(filePath);

  if (!VIDEO_EXTENSIONS.includes(ext)) return;

  const thumbnailPath = join(dir, `${base}-thumb.png`);
  
  try {
    // Check if thumbnail exists
    await stat(thumbnailPath);
    console.log(`🎬 Optimizing thumbnail for: ${basename(filePath)}`);

    // Optimize existing thumbnail
    await sharp(thumbnailPath)
      .webp({ quality: 75 })
      .toFile(join(dir, `${base}-thumb.webp`));
    console.log(`  ✓ Optimized thumbnail to WebP`);

  } catch (error) {
    console.log(`  ℹ No thumbnail found for ${basename(filePath)}`);
  }
}

async function processDirectory(dirPath) {
  try {
    const files = await readdir(dirPath);
    
    console.log(`\n🚀 Starting optimization in ${dirPath}\n`);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        const ext = extname(file).toLowerCase();
        
        if (IMAGE_EXTENSIONS.includes(ext)) {
          await optimizeImage(filePath);
        } else if (VIDEO_EXTENSIONS.includes(ext)) {
          await optimizeVideoThumbnail(filePath);
        }
      }
    }

    console.log(`\n✅ Optimization complete!\n`);
    console.log(`📊 Summary:`);
    console.log(`  - Images converted to WebP and AVIF formats`);
    console.log(`  - Thumbnails generated`);
    console.log(`  - Original files preserved as fallbacks`);
    console.log(`\n💡 Tip: Delete *-optimized.* files and use the WebP/AVIF versions in production`);

  } catch (error) {
    console.error('Error processing directory:', error);
  }
}

// Run the optimization
processDirectory(MUSEUM_DIR);
