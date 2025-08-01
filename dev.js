#!/usr/bin/env node

/* eslint-env node */
/* global console, setTimeout, process */

/**
 * Development script for Cosmo Landing Package
 *
 * Orchestrates the complete development workflow:
 * 1. Build React components and watch for changes
 * 2. Build Tailwind CSS and static site
 * 3. Watch for file changes and rebuild
 * 4. Serve the built site with live-server
 *
 * Usage:
 *   node dev.js                    # Frontend only
 */

import { spawn, exec } from 'child_process';
import { watch } from 'chokidar';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);

// port to use for live server
const PORT = 3002;

// Get local network IP address
async function getNetworkIP() {
  try {
    const platform = os.platform();
    let command;
    if (platform === 'win32') {
      command = 'ipconfig | findstr /i "IPv4 Address"';
    } else {
      // This command works for both macOS (BSD) and Linux
      command =
        'ifconfig | grep "inet " | grep -v 127.0.0.1 | awk \'{print $2}\' | head -1';
    }

    const { stdout } = await execAsync(command);
    const output = stdout.trim();

    if (!output) {
      return 'localhost';
    }

    if (platform === 'win32') {
      const lines = output.split('\n').filter(Boolean);
      // Get the last IP, which is typically the primary one
      const lastLine = lines[lines.length - 1];
      return lastLine.split(':').pop().trim();
    }
    return output;
  } catch {
    console.warn('⚠️  Could not determine network IP, using localhost');
    return 'localhost';
  }
}

// Paths
const REACT_DIR = path.join(__dirname, 'packages/react-ui');
const LANDING_DIR = path.join(__dirname, 'packages/landing');
const BUILD_DIR = path.join(__dirname, 'packages/build');
const DIST_DIR = path.join(__dirname, 'dist');
const REACT_OUTPUT_DIR = path.join(LANDING_DIR, 'js/components');
const REACT_FILES = [
  path.join(REACT_OUTPUT_DIR, 'index.js'),
  path.join(REACT_OUTPUT_DIR, 'vendor-chunk.js'),
  path.join(REACT_OUTPUT_DIR, 'assets'),
];

// Build lock mechanism to prevent concurrent builds
let buildInProgress = false;
let pendingBuild = false;

// Utility: Run a command and return a promise
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

// Utility: Wait for multiple files to exist
function waitForFiles(filePaths, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function check() {
      const allExist = filePaths.every((filePath) => fs.existsSync(filePath));

      if (allExist) {
        console.log(`✅ All React build files ready`);
        // Add a small delay to ensure files are fully written
        setTimeout(resolve, 1000);
      } else if (Date.now() - startTime > timeout) {
        const missing = filePaths.filter(
          (filePath) => !fs.existsSync(filePath)
        );
        reject(new Error(`Timeout waiting for files: ${missing.join(', ')}`));
      } else {
        setTimeout(check, 200);
      }
    }

    check();
  });
}

// Build Tailwind CSS
async function buildTailwind() {
  console.log('🎨 Building Tailwind CSS... from cwd: ' + __dirname);
  // dev.js  inside buildTailwind()
  await runCommand(
    'pnpm',
    [
      'exec',
      'tailwindcss',
      '-i',
      'packages/landing/src/css/styles.css',
      '-o',
      'packages/landing/src/css/output.css',
    ],
    { cwd: __dirname } // __dirname is the repo root
  );
}

// Run build.ts
async function runBuildScript() {
  console.log('🏗️  Running build script...');
  await runCommand('npx', ['tsx', '../build/build.ts'], {
    cwd: LANDING_DIR,
  });
}

// Debounced build function with lock mechanism
async function debouncedBuild(buildType = 'general') {
  if (buildInProgress) {
    console.log(
      `⏳ Build already in progress, marking ${buildType} build as pending...`
    );
    pendingBuild = true;
    return;
  }

  buildInProgress = true;
  pendingBuild = false;

  try {
    console.log(`🔄 Starting ${buildType} rebuild...`);
    await buildTailwind();
    await runBuildScript();
    console.log(`✅ ${buildType} rebuild complete`);
  } catch (error) {
    console.error(`❌ ${buildType} rebuild failed:`, error.message);
  } finally {
    buildInProgress = false;

    // If there was a pending build request, execute it after a short delay
    if (pendingBuild) {
      console.log('🔄 Executing pending build...');
      setTimeout(() => debouncedBuild('pending'), 1000);
    }
  }
}

// Start React build watcher
function startReactWatcher() {
  console.log('⚛️  Starting React build watcher...');
  const reactProcess = spawn('pnpm', ['build:watch'], {
    cwd: REACT_DIR,
    stdio: 'inherit',
    shell: true,
  });

  reactProcess.on('error', (err) => {
    console.error('❌ React watcher error:', err);
  });

  return reactProcess;
}

// Start file watchers with debouncing
function startFileWatchers() {
  console.log('👀 Starting file watchers...');

  // Watch main files (src and React output)
  const mainWatcher = watch(
    [
      path.join(LANDING_DIR, 'src/**/*'),
      path.join(LANDING_DIR, 'js/components/**/*'),
    ],
    {
      ignored: ['**/node_modules/**', '**/css/output.css'],
      persistent: true,
      ignoreInitial: true, // Don't trigger on startup
      awaitWriteFinish: {
        stabilityThreshold: 500, // Longer wait for React build outputs
        pollInterval: 100,
      },
    }
  );

  mainWatcher.on('change', async (filePath) => {
    const relativePath = path.relative(__dirname, filePath);
    if (relativePath.includes('js/components')) {
      console.log(`⚛️  React output changed: ${relativePath}`);
      await debouncedBuild('react-output');
    } else {
      console.log(`📝 Landing file changed: ${relativePath}`);
      await debouncedBuild('landing');
    }
  });

  // Watch geo files
  const geoWatcher = watch(
    [path.join(BUILD_DIR, 'geo.json'), path.join(BUILD_DIR, 'geo/**/*')],
    {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    }
  );

  geoWatcher.on('change', async (filePath) => {
    console.log(`🌍 Geo file changed: ${path.relative(__dirname, filePath)}`);
    if (buildInProgress) {
      console.log('⏳ Build in progress, marking geo build as pending...');
      pendingBuild = true;
      return;
    }

    buildInProgress = true;
    try {
      await runBuildScript();
      console.log('✅ Geo rebuild complete');
    } catch (error) {
      console.error('❌ Geo rebuild failed:', error.message);
    } finally {
      buildInProgress = false;
    }
  });

  // Return all watchers for cleanup
  return { mainWatcher, geoWatcher };
}

// Start live server
function startLiveServer() {
  console.log('🚀 Starting live server...');
  console.log(`📁 Serving from: ${DIST_DIR}`);
  const serverProcess = spawn(
    'npx',
    [
      'live-server',
      DIST_DIR,
      `--port=${PORT}`,
      '--cors',
      '--no-browser',
      '--wait=500',
    ],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  serverProcess.on('error', (err) => {
    console.error('❌ Live server error:', err);
  });

  return serverProcess;
}

// Main development workflow
async function main() {
  try {
    console.log('🚀 Starting Cosmo development environment...\n');

    await buildTailwind();
    await runBuildScript();

    // Start React build watcher
    startReactWatcher();

    // Start file watchers
    startFileWatchers();

    // Start live server
    await startLiveServer();

    // Wait for any key press to exit
    console.log('\nPress any key to exit...');
    await new Promise((resolve) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', () => {
        process.exit();
      });
    });
  } catch (error) {
    console.error('❌ Development server failed:', error);
    process.exit(1);
  }
}

main();
