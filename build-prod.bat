@echo off
echo Building Volleyball Tournament Tracker for Production
echo.

echo Building Frontend
cd frontend
npm run build

echo.
echo Frontend build complete. Files are in the dist folder.
echo.

echo To run the production version:
echo 1. Make sure MongoDB is running
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. Serve the frontend files from the frontend/dist folder
echo.

pause