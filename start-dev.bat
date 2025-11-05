@echo off
echo Starting Volleyball Tournament Tracker Development Environment
echo.

echo Starting MongoDB (make sure it's installed and in your PATH)
start mongod
timeout /t 5 /nobreak >nul

echo Starting Backend Server
cd backend
start "Backend" cmd /k "npm start"
timeout /t 5 /nobreak >nul

echo Starting Frontend Server
cd ../frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Development environment started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul