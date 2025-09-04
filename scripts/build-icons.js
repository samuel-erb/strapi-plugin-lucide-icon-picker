const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function downloadLucideData() {
  const tempDir = path.join(__dirname, '../temp-lucide');
  const dataDir = path.join(__dirname, '../data');

  console.log('Downloading latest Lucide data...');

  // Clean up existing temp and data directories
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  if (fs.existsSync(dataDir)) {
    fs.rmSync(dataDir, { recursive: true });
  }

  // Clone Lucide repo
  console.log(`git clone --depth 1 https://github.com/lucide-icons/lucide.git "${tempDir}"`)
  execSync(`git clone --depth 1 https://github.com/lucide-icons/lucide.git "${tempDir}"`, { stdio: 'inherit' });

  // Copy icons and categories folders
  fs.mkdirSync(dataDir, { recursive: true });
  fs.cpSync(path.join(tempDir, 'icons'), path.join(dataDir, 'icons'), { recursive: true });
  fs.cpSync(path.join(tempDir, 'categories'), path.join(dataDir, 'categories'), { recursive: true });

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true });

  console.log('\x1b[32m✔\x1b[0m Lucide data downloaded successfully');
}

function parseIconsAndCategories() {
  const iconsDir = path.join(__dirname, '../data/icons');
  const categoriesDir = path.join(__dirname, '../data/categories');
  const outputDir = path.join(__dirname, '../admin/src/data');

  // Parse icons
  const iconFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.json'));
  const icons = [];

  iconFiles.forEach(file => {
    const iconName = file.replace('.json', '');
    const iconData = JSON.parse(fs.readFileSync(path.join(iconsDir, file), 'utf8'));
    icons.push({
      name: iconName,
      $schema: iconData.$schema,
      contributors: iconData.contributors,
      tags: iconData.tags,
      categories: iconData.categories
    });
  });

  // Parse categories
  const categoryFiles = fs.readdirSync(categoriesDir).filter(file => file.endsWith('.json'));
  const categories = [];

  categoryFiles.forEach(file => {
    const categoryName = file.replace('.json', '');
    const categoryData = JSON.parse(fs.readFileSync(path.join(categoriesDir, file), 'utf8'));
    categories.push({
      name: categoryName,
      $schema: categoryData.$schema,
      title: categoryData.title,
      icon: categoryData.icon
    });
  });

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate TypeScript files
  const iconNamesContent = `export const ICON_NAMES = ${JSON.stringify(icons.map(icon => icon.name), null, 2)} as const;

export type IconName = typeof ICON_NAMES[number];
`;

  const iconsDataContent = `import type { Icon } from '../../custom';

export const ICONS_DATA: Icon[] = ${JSON.stringify(icons, null, 2)};
`;

  const categoriesDataContent = `import type { IconCategory } from '../../custom';

export const CATEGORIES_DATA: IconCategory[] = ${JSON.stringify(categories, null, 2)};
`;

  // Write files
  fs.writeFileSync(path.join(outputDir, 'iconNames.ts'), iconNamesContent);
  fs.writeFileSync(path.join(outputDir, 'iconsData.ts'), iconsDataContent);
  fs.writeFileSync(path.join(outputDir, 'categoriesData.ts'), categoriesDataContent);

  console.log(`\x1b[32m✔\x1b[0m Generated data for ${icons.length} icons and ${categories.length} categories`);
}

// Run the build process
downloadLucideData();
parseIconsAndCategories();
