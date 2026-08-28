param (
    [string]$GitHubToken = ""
)

$repoDir = $PSScriptRoot
Set-Location $repoDir

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Pushing Frontend to GitHub: https://github.com/adithya5693a/SIH_ayush.git" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$gitCmd = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitCmd) {
    Write-Host "[!] Git executable was not detected in PATH." -ForegroundColor Yellow
    Write-Host "[*] You can install Git from https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host "[*] Once Git is installed, run this script or double-click push_to_github.bat." -ForegroundColor Green
    return
}

if (-not (Test-Path "$repoDir\.git")) {
    Write-Host "[*] Initializing local git repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/adithya5693a/SIH_ayush.git
}

Write-Host "[*] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[*] Committing frontend dashboard files..." -ForegroundColor Yellow
git commit -m "Add AYUSH IPR & ABS Compliance Assistant frontend dashboard"

Write-Host "[*] Setting branch to main..." -ForegroundColor Yellow
git branch -M main

if ($GitHubToken -ne "") {
    $remoteWithAuth = "https://${GitHubToken}@github.com/adithya5693a/SIH_ayush.git"
    Write-Host "[*] Pushing with provided Personal Access Token..." -ForegroundColor Yellow
    git push -u $remoteWithAuth main
} else {
    Write-Host "[*] Pushing to remote main branch..." -ForegroundColor Yellow
    git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Pushed successfully to GitHub repository!" -ForegroundColor Green
} else {
    Write-Host "[NOTE] If prompted for credentials, enter your GitHub username and Personal Access Token (PAT)." -ForegroundColor Cyan
}
