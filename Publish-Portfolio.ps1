# Publishes ONLY to the explicitly requested repository. No force pushes.
# Requires Git, Node.js 22+, npm, and the user's own authenticated GitHub account.
[CmdletBinding()]
param([switch]$Push)
$ErrorActionPreference = 'Stop'
$Repository = 'https://github.com/MuhammadNoman76/nomanshafiq-portfolio.git'
$Source = $PSScriptRoot
foreach ($command in @('git', 'node', 'npm')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "Install $command before continuing." }
}
function Invoke-Checked {
  param([string]$Program, [string[]]$Arguments)
  & $Program @Arguments
  if ($LASTEXITCODE -ne 0) { throw "$Program failed with exit code $LASTEXITCODE. Nothing further will be published." }
}
$NodeVersion = (& node --version).TrimStart('v').Split('.')[0]
if ([int]$NodeVersion -lt 22) { throw 'Node.js 22 or newer is required.' }
$Work = Join-Path ([IO.Path]::GetTempPath()) ('noman-kinetic-' + [guid]::NewGuid().ToString('N'))
Invoke-Checked git @('clone', '--branch', 'main', $Repository, $Work)
$Base = (& git -C $Work rev-parse HEAD).Trim()
if (-not (Test-Path (Join-Path $Work '.git'))) { throw 'Refusing to modify an unverified working directory.' }
$Remote = (& git -C $Work remote get-url origin).Trim()
if ($Remote -ne $Repository) { throw 'Unexpected Git remote. Stopping.' }

# Replace the old website only inside this newly created temporary clone.
# The repository history and its existing license are preserved.
Get-ChildItem -LiteralPath $Work -Force | Where-Object {
  $_.Name -ne '.git' -and $_.Name -notmatch '^(LICENSE|COPYING|NOTICE)(\..*)?$'
} | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force }
$Exclude = @('.git','node_modules','.next','out','visual-preview','.wrangler','.env','.env.local','.env.production')
Get-ChildItem -LiteralPath $Source -Force | Where-Object {
  $_.Name -notin $Exclude -and $_.Name -notlike '*.tsbuildinfo'
} | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $Work -Recurse -Force }

Push-Location $Work
try {
  # First install creates the lockfile; subsequent installs use npm ci.
  if (Test-Path 'package-lock.json') { Invoke-Checked npm @('ci') }
  else { Invoke-Checked npm @('install') }
  Invoke-Checked npm @('run','verify')
  if (-not (Test-Path 'out/index.html')) { throw 'The real Next.js export is missing.' }
  Write-Host "Verified build prepared at $Work" -ForegroundColor Green
  if (-not $Push) {
    Write-Host 'No commit or push performed. Rerun with -Push to publish after verification.'
    return
  }
  $CurrentRemote = ((& git ls-remote origin refs/heads/main) -split '\s+')[0]
  if ($LASTEXITCODE -ne 0 -or $CurrentRemote -ne $Base) {
    throw 'Remote main changed during verification. Review the new changes and rerun; no force push will be attempted.'
  }
  if (-not (& git config user.name) -or -not (& git config user.email)) {
    throw 'Configure your Git author name and email before publishing; no identity will be invented.'
  }
  Invoke-Checked git @('add','--all')
  & git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host 'No source changes to commit.'; return }
  if ($LASTEXITCODE -ne 1) { throw 'Could not inspect the staged changes.' }
  Invoke-Checked git @('commit','-m','feat: replace portfolio with original kinetic 3D experience')
  Invoke-Checked git @('push','origin','HEAD:main')
  $Commit = (& git rev-parse HEAD).Trim()
  Write-Host "Pushed $Commit to main. Check this exact commit in your existing Cloudflare Pages deployment." -ForegroundColor Green
  Write-Host 'A successful Git push is not confirmation of a successful Cloudflare deployment.'
}
finally { Pop-Location }
