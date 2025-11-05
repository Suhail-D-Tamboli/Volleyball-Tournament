@echo off
echo Stopping Volleyball Tournament Tracker Services
echo.

echo Stopping MongoDB
taskkill /f /im mongod.exe

echo Stopping Backend Server
taskkill /f /im node.exe

echo Stopping Frontend Server
taskkill /f /im node.exe

echo.
echo All services stopped!
echo.
pause