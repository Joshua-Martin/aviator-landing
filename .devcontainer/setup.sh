#!/bin/bash
set -e

echo "Setting up development environment..."

cd /workspace

# Increase Node.js memory limits to prevent bus errors
export NODE_OPTIONS="--max_old_space_size=8192"

# Clean up any potential conflicts from previous installs
echo "Cleaning up potential package management conflicts..."
rm -rf node_modules/.cache || true
rm -rf node_modules/@swc || true

# Check if node_modules already exists and has content
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  echo "Node modules not found or empty, installing dependencies..."
  
  # Clean npm cache to prevent corruption
  npm cache clean --force
  
  # Install dependencies with increased memory and better error handling
  echo "Installing dependencies with scripts enabled..."
  npm ci --no-fund --no-audit --prefer-offline || {
    echo "npm ci failed, trying npm install as fallback..."
    rm -rf node_modules || true
    npm install --no-fund --no-audit --prefer-offline
  }
else
  echo "Node modules already installed, skipping npm installation"
fi

echo "Setup complete!"
