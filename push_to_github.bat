@echo off
setlocal
cd /d "%~dp0"
echo =======================================================
echo  Pushing AYUSH IPR & ABS Assistant to GitHub Repository
echo  Target: https://github.com/adithya5693a/SIH_ayush.git
echo =======================================================
echo.

set "GIT_EXE=%~dp0..\mingit\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo Using Git: "%GIT_EXE%"
"%GIT_EXE%" status
echo.
echo Adding any untracked or modified files...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Update AYUSH IPR, ABS & Regulatory Assistant frontend platform" --allow-empty
echo.
echo Pushing to GitHub (origin/main)...
"%GIT_EXE%" push -u origin main

echo.
echo =======================================================
echo  Done! Press any key to exit.
echo =======================================================
pause
