param(
    [Parameter(Mandatory=$true)]
    [string]$name
)

$pkgPath = "packages/$name"

# Tạo folder
New-Item -ItemType Directory -Force -Path $pkgPath | Out-Null

# pnpm init
Set-Location $pkgPath
pnpm init

Write-Host "Package '$name' created at $pkgPath"
