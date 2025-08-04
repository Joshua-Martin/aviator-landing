/**
 * Custom static site build script for Cosmo Landing Package
 *
 * - Reads geo.json for build configuration
 * - Copies only needed files from sourceDir to /dist, excluding ignore list
 * - Replaces specified element IDs in HTML files with contents of geoDir files
 * - Generates CSS files with geo-root class and optional additional styles
 *
 * Usage: node ../build/build.ts (from packages/landing)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Type definitions for the geo.json configuration
interface ReplacementConfig {
  targetHtml: string;
  elementId: string;
  replacementFile: string;
}

interface GeoConfig {
  sourceDir: string;
  geoDir: string;
  cssOutputDir?: string;
  geoCss?: string;
  ignore?: string[];
  replacements?: ReplacementConfig[];
  faqSchema?: {
    enabled: boolean;
    sourceFile: string;
    targetHtml: string;
    insertBeforeTag: string;
  };
}

// Get workspace root (two levels up from this script)
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const WORKSPACE_ROOT: string = path.resolve(__dirname, '../..');

// 1. Read geo.json config (always from workspace root)
const GEO_CONFIG_PATH: string = path.join(WORKSPACE_ROOT, 'packages/build/geo.json');
if (!fs.existsSync(GEO_CONFIG_PATH)) {
  throw new Error('geo.json config not found at ' + GEO_CONFIG_PATH);
}

const geoConfig: GeoConfig = JSON.parse(fs.readFileSync(GEO_CONFIG_PATH, 'utf8'));

const SRC_DIR: string = path.join(WORKSPACE_ROOT, geoConfig.sourceDir);
const DIST_DIR: string = path.join(WORKSPACE_ROOT, 'dist');
const GEO_DIR: string = path.join(WORKSPACE_ROOT, geoConfig.geoDir);
const CSS_OUTPUT_DIR: string = path.join(WORKSPACE_ROOT, geoConfig.cssOutputDir || 'dist/css');
const GEO_CSS_PATH: string | null = geoConfig.geoCss ? path.join(WORKSPACE_ROOT, geoConfig.geoCss) : null;
const IGNORE: string[] = geoConfig.ignore || [];
const REPLACEMENTS: ReplacementConfig[] = geoConfig.replacements || [];

/**
 * Recursively copy directory, excluding files/dirs in ignore list
 * @param src - Source directory path
 * @param dest - Destination directory path
 * @param ignoreList - List of files/directories to ignore
 */
function copyDir(src: string, dest: string, ignoreList: string[] = []): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  for (const item of fs.readdirSync(src)) {
    const srcPath: string = path.join(src, item);
    // Compute path relative to the top-level source directory so that nested ignores work
    const relativePath: string = path.relative(SRC_DIR, srcPath).split(path.sep).join('/');

    // Skip file/directory when either its base name OR its relative path is in the ignore list
    if (ignoreList.includes(item) || ignoreList.includes(relativePath)) {
      console.log(`Ignoring: ${relativePath}`);
      continue;
    }
    
    const destPath: string = path.join(dest, item);
    const stat: fs.Stats = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      console.log(`Copying directory: ${item}`);
      copyDir(srcPath, destPath, ignoreList);
    } else {
      console.log(`Copying file: ${item}`);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Generate CSS content with geo-root class and optional additional styles
 * @returns Generated CSS content as string
 */
function generateCssContent(): string {
  let cssContent: string = '.geo-root {\n    display: none;\n}\n';
  
  // Append additional CSS if geoCss path is provided
  if (GEO_CSS_PATH && fs.existsSync(GEO_CSS_PATH)) {
    const additionalCss: string = fs.readFileSync(GEO_CSS_PATH, 'utf8');
    cssContent += '\n' + additionalCss;
    console.log(`Appending additional CSS from: ${GEO_CSS_PATH}`);
  }
  
  return cssContent;
}

/**
 * Inject CSS link into HTML head section
 * @param html - HTML content to modify
 * @param cssPath - Path to CSS file (default: './css/geo.css')
 * @returns Modified HTML with CSS link injected
 */
function injectCssLink(html: string, cssPath: string = './css/geo.css'): string {
  const cssLink: string = `<link href="${cssPath}" rel="stylesheet" media="all" />`;
  
  // Check if the CSS link already exists to avoid duplicates
  if (html.includes(cssLink)) {
    return html;
  }
  
  // Try to find </head> tag and insert before it
  const headCloseMatch: RegExpMatchArray | null = html.match(/<\/head>/i);
  if (headCloseMatch) {
    return html.replace(/<\/head>/i, `  ${cssLink}\n</head>`);
  }
  
  // If no </head> found, try to find <head> and insert after it
  const headOpenMatch: RegExpMatchArray | null = html.match(/<head[^>]*>/i);
  if (headOpenMatch) {
    return html.replace(/<head[^>]*>/i, `${headOpenMatch[0]}\n  ${cssLink}`);
  }
  
  // If no head section found, try to insert after <html>
  const htmlOpenMatch: RegExpMatchArray | null = html.match(/<html[^>]*>/i);
  if (htmlOpenMatch) {
    return html.replace(/<html[^>]*>/i, `${htmlOpenMatch[0]}\n<head>\n  ${cssLink}\n</head>`);
  }
  
  // Last resort: prepend to document
  return `<head>\n  ${cssLink}\n</head>\n${html}`;
}

/**
 * Replace any element with the specified ID with replacement HTML and add geo-root class
 * This function will replace the entire element (including its content) with the replacement HTML
 * Special handling for section elements to ensure proper semantic structure
 * @param html - HTML content to modify
 * @param elementId - ID of the element to replace
 * @param replacement - Replacement HTML content
 * @returns Modified HTML with replacement applied
 */
function replaceRootDiv(html: string, elementId: string, replacement: string): string {
  // Improved regex that matches any HTML element with the specified ID, including content
  // This handles:
  // - Any element type (div, section, span, etc.)
  // - Elements with or without content
  // - Elements with additional attributes
  // - Nested elements properly
  const regex: RegExp = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\s+id=["']${elementId}["'][^>]*)>(.*?)</\\1>`,
    'gis'
  );
  
  // Handle geo-root class addition with special section logic
  let replacementWithClass: string;
  
  // Check if replacement starts with a section element
  const sectionMatch: RegExpMatchArray | null = replacement.match(/^<section(\s[^>]*)?>(.*)(<\/section>)$/s);
  
  if (sectionMatch) {
    // Replacement is a section, add geo-root class to existing attributes
    const existingAttrs: string = sectionMatch[1] || '';
    const content: string = sectionMatch[2];
    const closingTag: string = sectionMatch[3];
    
    // Check if class attribute already exists
    if (existingAttrs.includes('class=')) {
      replacementWithClass = replacement.replace(/class=["']([^"']*)["']/, 'class="$1 geo-root"');
    } else {
      replacementWithClass = `<section${existingAttrs} class="geo-root">${content}${closingTag}`;
    }
  } else {
    // Replacement is not a section, wrap it with section and geo-root class
    replacementWithClass = `<section class="geo-root">${replacement}</section>`;
  }
  
  // Perform the replacement
  const result: string = html.replace(regex, replacementWithClass);
  
  // Check if replacement was successful
  if (result === html) {
    console.warn(`⚠️  Element with ID "${elementId}" not found or could not be replaced`);
  }
  
  return result;
}

/**
 * Generate FAQ Schema from JSON file
 * @param faqJsonPath - Path to FAQ JSON file
 * @returns Generated FAQ schema as string
 */
function generateFaqSchema(faqJsonPath: string): string {
  const faqData = JSON.parse(fs.readFileSync(faqJsonPath, 'utf8'));
  
  const schemaObject = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return `
    <script type="application/ld+json">
      ${JSON.stringify(schemaObject, null, 2)}
    </script>`;
}

/**
 * Insert FAQ Schema into HTML file
 * @param htmlPath - Path to HTML file
 * @param schema - FAQ schema to insert
 * @param insertBeforeTag - Tag before which to insert the schema
 */
function insertFaqSchema(htmlPath: string, schema: string, insertBeforeTag: string): void {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Remove any existing FAQ schema
  html = html.replace(
    /<script type="application\/ld\+json">\s*{\s*"@context":\s*"https:\/\/schema.org",\s*"@type":\s*"FAQPage"[^<]*<\/script>/g,
    ''
  );
  
  // Insert new schema before specified tag
  html = html.replace(insertBeforeTag, `${schema}\n  ${insertBeforeTag}`);
  
  fs.writeFileSync(htmlPath, html, 'utf8');
}

/**
 * Main build process
 * Orchestrates the entire build pipeline including file copying, CSS generation, and HTML replacements
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Cosmo Landing Package build process...\n');
    
    // 1. Clean/create dist directory with retry logic for concurrent builds
    console.log('📁 Setting up dist directory...');
    
    // Safer directory cleanup with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        if (fs.existsSync(DIST_DIR)) {
          // Use a more robust cleanup approach
          await cleanDistDirectory(DIST_DIR);
        }
        fs.mkdirSync(DIST_DIR, { recursive: true });
        break; // Success, exit retry loop
      } catch (error: any) {
        retryCount++;
        if (error.code === 'ENOTEMPTY' || error.code === 'EBUSY') {
          console.log(`⏳ Directory busy, retrying cleanup (${retryCount}/${maxRetries})...`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
          
          if (retryCount >= maxRetries) {
            console.log('⚠️  Could not clean dist directory, proceeding with existing files...');
            // Ensure directory exists even if we couldn't clean it
            if (!fs.existsSync(DIST_DIR)) {
              fs.mkdirSync(DIST_DIR, { recursive: true });
            }
            break;
          }
        } else {
          throw error; // Re-throw non-concurrency related errors
        }
      }
    }
    
    console.log('✅ Dist directory ready\n');

    // 2. Create CSS output directory and generate geo.css
    console.log('🎨 Generating CSS files...');
    if (!fs.existsSync(CSS_OUTPUT_DIR)) {
      fs.mkdirSync(CSS_OUTPUT_DIR, { recursive: true });
    }
    
    const cssContent: string = generateCssContent();
    const geoCssPath: string = path.join(CSS_OUTPUT_DIR, 'geo.css');
    fs.writeFileSync(geoCssPath, cssContent, 'utf8');
    console.log(`✅ Generated CSS file: ${geoCssPath}\n`);

    // 3. Copy static files (exclude files/dirs in ignore list)
    console.log('📋 Copying static files...');
    copyDir(SRC_DIR, DIST_DIR, IGNORE);
    console.log('✅ Static files copied\n');

    // 4. For each replacement, perform the replacement in the target HTML file
    console.log('🔄 Processing HTML replacements...');
    for (const { targetHtml, elementId, replacementFile } of REPLACEMENTS) {
      const targetPath: string = path.join(DIST_DIR, targetHtml);
      const replacementPath: string = path.join(GEO_DIR, replacementFile);
      
      if (!fs.existsSync(targetPath)) {
        console.warn(`⚠️  Target HTML file not found: ${targetPath}`);
        continue;
      }
      
      if (!fs.existsSync(replacementPath)) {
        console.warn(`⚠️  Replacement file not found: ${replacementPath}`);
        continue;
      }
      
      let html: string = fs.readFileSync(targetPath, 'utf8');
      const replacement: string = fs.readFileSync(replacementPath, 'utf8');
      html = replaceRootDiv(html, elementId, replacement);
      html = injectCssLink(html);
      fs.writeFileSync(targetPath, html, 'utf8');
      console.log(`✅ Replaced element "${elementId}" in ${targetHtml} with geo-root class`);
    }

    // 5. Generate and insert FAQ Schema if enabled
    if (geoConfig.faqSchema?.enabled) {
      console.log('\n📝 Generating FAQ Schema...');
      const faqJsonPath = path.join(WORKSPACE_ROOT, geoConfig.faqSchema.sourceFile);
      const targetHtmlPath = path.join(DIST_DIR, geoConfig.faqSchema.targetHtml);

      if (!fs.existsSync(faqJsonPath)) {
        console.warn(`⚠️  FAQ JSON file not found: ${faqJsonPath}`);
      } else if (!fs.existsSync(targetHtmlPath)) {
        console.warn(`⚠️  Target HTML file not found: ${targetHtmlPath}`);
      } else {
        const schema = generateFaqSchema(faqJsonPath);
        insertFaqSchema(
          targetHtmlPath,
          schema,
          geoConfig.faqSchema.insertBeforeTag
        );
        console.log('✅ FAQ Schema generated and inserted');
      }
    }

    // 6. Log summary
    console.log('\n🎉 Build complete!');
    console.log(`📦 Output directory: ${DIST_DIR}`);
    console.log(`🎨 CSS files generated in: ${CSS_OUTPUT_DIR}`);
    console.log(`📊 Processed ${REPLACEMENTS.length} HTML replacement(s)`);
    if (geoConfig.faqSchema?.enabled) {
      console.log('📝 FAQ Schema generated and inserted');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Safely clean the dist directory with retry logic for concurrent builds
 * @param dirPath - Directory path to clean
 */
async function cleanDistDirectory(dirPath: string): Promise<void> {
  try {
    // First, try to remove individual files and subdirectories
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively clean subdirectories
        await cleanDistDirectory(itemPath);
        try {
          fs.rmdirSync(itemPath);
        } catch (error: any) {
          if (error.code !== 'ENOTEMPTY') {
            throw error;
          }
          // If still not empty, try rmSync as fallback
          fs.rmSync(itemPath, { recursive: true, force: true });
        }
      } else {
        fs.unlinkSync(itemPath);
      }
    }
  } catch (error: any) {
    // If individual cleanup fails, try the nuclear option
    if (error.code === 'ENOTEMPTY' || error.code === 'EBUSY') {
      throw error; // Let the caller handle retry logic
    }
    
    // For other errors, try rmSync as fallback
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Execute main function if this script is run directly
if (import.meta.url.startsWith('file:')) {
  const scriptPath = fileURLToPath(import.meta.url);
  const isDirectRun = process.argv[1] && (
    process.argv[1] === scriptPath ||
    process.argv[1].endsWith('build.ts') ||
    process.argv[1].includes('tsx')
  );
  
  if (isDirectRun) {
    console.log('🔧 Build script detected as direct run, executing main()...');
    main().catch((error) => {
      console.error('❌ Build failed:', error);
      process.exit(1);
    });
  } else {
    console.log('📝 Build script loaded as module, main() not auto-executed');
    console.log(`📍 import.meta.url: ${import.meta.url}`);
    console.log(`📍 process.argv[1]: ${process.argv[1]}`);
  }
}

export { main, copyDir, generateCssContent, injectCssLink, replaceRootDiv };
export type { GeoConfig, ReplacementConfig }; 