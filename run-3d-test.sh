#!/bin/bash

echo "Starting Next.js development server..."
npm run dev &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 15

echo "Running Puppeteer test..."
node test-3d-component.cjs

echo "Stopping server..."
kill $SERVER_PID

echo "Test complete!"