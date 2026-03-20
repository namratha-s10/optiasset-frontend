@echo off
echo Starting OptiAsset Servers...

echo [1/3] Starting FastAPI Backend on Port 8000...
start cmd /k "cd C:\Users\Dell\Desktop\docker-task && uvicorn main:app --reload"

echo [2/3] Starting Next.js Frontend on Port 3000...
start cmd /k "cd C:\Users\Dell\Desktop\docker-task\optiasset-frontend\next-app && npm run dev"

echo [3/3] Waiting 12 seconds for the servers to boot up...
timeout /t 12 /nobreak

echo Opening your web browser!
start http://localhost:3000
