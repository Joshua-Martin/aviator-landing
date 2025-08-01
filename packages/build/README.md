# Cosmo Landing Package Build System

A powerful, flexible static site build system designed for geo-specific content injection and CSS management. This build system allows you to create location-aware websites by dynamically replacing content based on geographical configurations.

## 🚀 Features

- **Geo-specific Content Injection**: Replace HTML elements with location-specific content
- **Dynamic CSS Generation**: Automatically generate CSS with geo-root classes and custom styles
- **File System Management**: Intelligent copying with ignore patterns
- **TypeScript Support**: Fully typed build process with comprehensive error handling
- **HTML Template Support**: Simple HTML files for content injection
- **Flexible Configuration**: JSON-based configuration for easy customization

## 📁 Project Structure

```
packages/build/
├── build.ts              # Main TypeScript build script
├── geo.json              # Build configuration file
├── css/
│   └── geo.css          # Additional CSS styles to append
├── geo/
│   └── index.html       # HTML content for geo-specific injection
└── README.md            # This documentation
```

## ⚙️ Configuration

The build system is configured via `geo.json`:

```json
{
  "sourceDir": "packages/landing",
  "geoDir": "packages/build/geo", 
  "cssOutputDir": "dist/css",
  "geoCss": "packages/build/css/geo.css",
  "ignore": ["package.json", "node_modules", "tailwind.config.js", "postcss.config.js"],
  "replacements": [
    {
      "targetHtml": "index.html",
      "elementId": "geo-root", 
      "replacementFile": "index.html"
    }
  ]
}
```

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `sourceDir` | `string` | Source directory to copy files from | Required |
| `geoDir` | `string` | Directory containing geo-specific content | Required |
| `cssOutputDir` | `string` | Output directory for generated CSS | `"dist/css"` |
| `geoCss` | `string` | Path to additional CSS file to append | Optional |
| `ignore` | `string[]` | Files/directories to ignore during copy | `[]` |
| `replacements` | `ReplacementConfig[]` | HTML replacement configurations | `[]` |

### Replacement Configuration

Each replacement object supports:

```typescript
interface ReplacementConfig {
  targetHtml: string;      // Target HTML file in dist
  elementId: string;       // ID of element to replace
  replacementFile: string; // Source file in geoDir
}
```

## 🛠️ Usage

### Basic Usage

```bash
# From the workspace root
node packages/build/build.ts

# Or from packages/landing
node ../build/build.ts
```

### Development Workflow

1. **Configure** your build in `geo.json`
2. **Create** geo-specific content in `packages/build/geo/`
3. **Add** custom styles to `packages/build/css/geo.css` (optional)
4. **Run** the build script
5. **Deploy** the generated `dist/` directory

### TypeScript Integration

The build script is fully typed and exports useful types and functions:

```typescript
import { main, GeoConfig, ReplacementConfig } from './build';

// Use the main build function
main();

// Or use individual utilities
import { copyDir, generateCssContent, injectCssLink, replaceRootDiv } from './build';
```

## 🎨 CSS Management

### Automatic CSS Generation

The build system automatically generates a `geo.css` file with:

1. **Base geo-root class**: `.geo-root { display: none; }`
2. **Additional styles**: Content from `geoCss` file (if specified)

### CSS Injection

CSS links are automatically injected into HTML files:

```html
<link href="./css/geo.css" rel="stylesheet" media="all" />
```

The injection logic tries multiple strategies:
1. Insert before `</head>` tag
2. Insert after `<head>` tag  
3. Insert after `<html>` tag
4. Prepend to document as fallback

## 🔄 HTML Replacement System

### How It Works

1. **Target Identification**: Finds `<div id="ELEMENT_ID"></div>` in target HTML
2. **Content Replacement**: Replaces with content from replacement file
3. **Class Addition**: Automatically adds `geo-root` class to replacement content
4. **CSS Injection**: Ensures CSS link is present in HTML head

### Replacement Logic

```typescript
// Original HTML
<div id="geo-root"></div>

// Replacement content (from geo/index.html)
<div><h1>Geo Content</h1></div>

// Final result
<div class="geo-root"><h1>Geo Content</h1></div>
```

## 📄 HTML Template System

### Creating HTML Templates

HTML files in the `geo/` directory contain the content to be injected:

```html
<div>
  <h1>Location-Specific Content</h1>
  <p>This content will be injected into the target HTML</p>
  <p>You can include any HTML elements here</p>
</div>
```

### Template Processing

The build system processes HTML templates by:
1. Reading the HTML content from the file
2. Automatically wrapping content with `geo-root` class
3. Injecting the processed content into target HTML files

## 🚨 Error Handling

The build system includes comprehensive error handling:

- **Missing Files**: Warns about missing target or replacement files
- **Invalid Configuration**: Validates geo.json structure
- **File System Errors**: Graceful handling of permission/access issues
- **Build Failures**: Clear error messages with exit codes

## 🔧 Advanced Usage

### Custom Build Scripts

You can extend the build system by importing its utilities:

```typescript
import { copyDir, generateCssContent } from './build';

// Custom build logic
async function customBuild() {
  // Copy specific directories
  copyDir('src/assets', 'dist/assets', ['*.tmp']);
  
  // Generate custom CSS
  const css = generateCssContent();
  // ... custom processing
}
```

### Multiple Geo Configurations

For multiple geographical regions, create separate geo.json files:

```bash
geo-us.json
geo-eu.json  
geo-asia.json
```

Then run builds with different configurations:

```bash
cp geo-us.json geo.json && node build.ts
cp geo-eu.json geo.json && node build.ts
```

## 📊 Build Output

### Console Output

The build process provides detailed logging:

```
🚀 Starting Cosmo Landing Package build process...

📁 Setting up dist directory...
✅ Dist directory ready

🎨 Generating CSS files...
✅ Generated CSS file: /path/to/dist/css/geo.css

📋 Copying static files...
Copying file: index.html
Copying file: styles.css
✅ Static files copied

🔄 Processing HTML replacements...
✅ Replaced element "geo-root" in index.html with geo-root class

🎉 Build complete!
📦 Output directory: /path/to/dist
🎨 CSS files generated in: /path/to/dist/css
📊 Processed 1 HTML replacement(s)
```

### Generated Files

After a successful build:

```
dist/
├── index.html           # Processed HTML with replacements
├── css/
│   └── geo.css         # Generated CSS with geo-root styles
└── [other copied files] # Static assets from sourceDir
```

## 🤝 Contributing

When contributing to the build system:

1. **Maintain TypeScript types** for all new features
2. **Add comprehensive JSDoc comments** for functions
3. **Include error handling** for new functionality
4. **Update this README** for any configuration changes
5. **Test with multiple geo configurations**

## 📝 Migration Guide

### From JavaScript to TypeScript

If migrating from the legacy `build.js`:

1. Update import statements to use `build.ts`
2. Add type annotations to custom extensions
3. Update package.json scripts to reference `.ts` file
4. Install TypeScript dependencies if needed

### HTML Template Best Practices

When creating HTML templates:

1. Keep HTML semantic and accessible
2. Use meaningful class names for styling
3. Ensure content is self-contained within the template
4. Test templates in different contexts and screen sizes

## 🐛 Troubleshooting

### Common Issues

**Build fails with "geo.json not found"**
- Ensure geo.json exists in packages/build/
- Check file permissions and path resolution

**CSS not injecting properly**
- Verify HTML structure has proper head section
- Check CSS output directory permissions
- Ensure geoCss path is correct in configuration

**Replacement not working**
- Verify elementId matches exactly in target HTML
- Check that replacement file exists in geoDir
- Ensure target HTML file is copied to dist first

**TypeScript compilation errors**
- Install required @types packages
- Check tsconfig.json configuration
- Verify import paths are correct

### Debug Mode

For detailed debugging, modify the build script to include:

```typescript
const DEBUG = process.env.DEBUG === 'true';

if (DEBUG) {
  console.log('Debug info:', { SRC_DIR, DIST_DIR, GEO_DIR });
}
```

Run with: `DEBUG=true node build.ts`

---

## 📄 License

This build system is part of the Cosmo Landing Package project. See the main project README for license information. 