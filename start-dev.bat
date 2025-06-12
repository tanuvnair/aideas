@echo off

echo Starting Frontend...
start cmd /k "cd shadcn-frontend && npm run dev"

echo Starting Backend...
start cmd /k "cd backend && npm run dev"

echo Both Frontend and Backend are running. Press any key to exit.

