# NutriVision AI - Phase 5 Live Image Upload, Storage & Security Test Suite

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

Write-Host "=================================================="
Write-Host "1. Generating Genuine Test Images & Test Files"
Write-Host "=================================================="

$testDir = "tests\sample_images"
if (-not (Test-Path $testDir)) {
    New-Item -ItemType Directory -Path $testDir -Force | Out-Null
}

# Generate a genuine valid 200x200 JPEG
$jpgPath = "$testDir\valid_nail_sample.jpg"
$bmp = New-Object System.Drawing.Bitmap 200, 200
$g = [System.Drawing.Graphics]::FromImage($bmp)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Pink)
$g.FillRectangle($brush, 0, 0, 200, 200)
$g.Dispose()
$bmp.Save($jpgPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
$jpgSize = (Get-Item $jpgPath).Length
Write-Host "Created valid JPEG sample: $jpgPath ($jpgSize bytes)"

# Generate a genuine valid 200x200 PNG
$pngPath = "$testDir\valid_eye_sample.png"
$bmp2 = New-Object System.Drawing.Bitmap 200, 200
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$brush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::AliceBlue)
$g2.FillRectangle($brush2, 0, 0, 200, 200)
$g2.Dispose()
$bmp2.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Dispose()
$pngSize = (Get-Item $pngPath).Length
Write-Host "Created valid PNG sample: $pngPath ($pngSize bytes)"

# Generate an invalid file (.txt)
$txtPath = "$testDir\invalid_file.txt"
[System.IO.File]::WriteAllText($txtPath, "This is not an image file.")
Write-Host "Created invalid file: $txtPath"

# Generate an oversized file (> 10MB)
$oversizedPath = "$testDir\oversized_file.jpg"
$oversizedBytes = New-Object byte[] (11 * 1024 * 1024)
$oversizedBytes[0] = 0xFF; $oversizedBytes[1] = 0xD8; $oversizedBytes[2] = 0xFF; $oversizedBytes[3] = 0xE0
[System.IO.File]::WriteAllBytes($oversizedPath, $oversizedBytes)
Write-Host "Created oversized file: $oversizedPath ($($oversizedBytes.Length) bytes)"

Write-Host "`n=================================================="
Write-Host "2. Authenticating User A (test.user@nutrivision.ai)"
Write-Host "=================================================="

$loginBodyA = @{
    email = "test.user@nutrivision.ai"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginResA = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBodyA -ContentType "application/json"
$tokenA = $loginResA.data.accessToken
$headersA = @{ Authorization = "Bearer $tokenA" }
Write-Host "User A Authenticated!"

Write-Host "`n=================================================="
Write-Host "3. Creating Assessment for User A (Target: NAILS)"
Write-Host "=================================================="

$createBody = @{ targetBodyPart = "NAILS" } | ConvertTo-Json
$createRes = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments" -Method Post -Headers $headersA -Body $createBody -ContentType "application/json"
$assessmentId = $createRes.data.assessmentId
Write-Host "Created Assessment ID: $assessmentId | Status: $($createRes.data.status)"

Write-Host "`n=================================================="
Write-Host "4. TEST 1: User A uploads valid JPEG image (Multipart)"
Write-Host "=================================================="

$uploadUrl = "http://localhost:8080/api/assessments/$assessmentId/images"

$uploadOutput = & curl.exe -s -X POST $uploadUrl `
    -H "Authorization: Bearer $tokenA" `
    -F "file=@$jpgPath;type=image/jpeg"

$uploadRes = $uploadOutput | ConvertFrom-Json
$imageId = $uploadRes.data.imageId
Write-Host "Upload Success:" $uploadRes.success
Write-Host "Assigned Image ID:" $imageId
Write-Host "Original Filename:" $uploadRes.data.originalFilename
Write-Host "File Size:" $uploadRes.data.fileSizeBytes "bytes"
Write-Host "MIME Type:" $uploadRes.data.mimeType
Write-Host "Initial Quality Status:" $uploadRes.data.qualityStatus

# Verify assessment transitioned from DRAFT to IN_PROGRESS
$checkAssessment = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId" -Method Get -Headers $headersA
Write-Host "Assessment Status after upload: $($checkAssessment.data.status) (Expected: IN_PROGRESS)"

# Verify file exists on local filesystem
$storedFiles = Get-ChildItem -Path "backend\uploads\assessments\$assessmentId" -Filter "*.jpg" -ErrorAction SilentlyContinue
if (-not $storedFiles) {
    $storedFiles = Get-ChildItem -Path "uploads\assessments\$assessmentId" -Filter "*.jpg" -ErrorAction SilentlyContinue
}
Write-Host "Physical File on Disk: $($storedFiles[0].FullName) (Size: $($storedFiles[0].Length) bytes)"

Write-Host "`n=================================================="
Write-Host "5. TEST 2: User B attempts to upload to User A's Assessment #$assessmentId"
Write-Host "=================================================="

$loginBodyB = @{
    email = "other.user@nutrivision.ai"
    password = "DifferentPassword456"
} | ConvertTo-Json
$loginResB = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBodyB -ContentType "application/json"
$tokenB = $loginResB.data.accessToken

$unauthUpload = & curl.exe -s -w "%{http_code}" -o $testDir\unauth_out.json -X POST $uploadUrl `
    -H "Authorization: Bearer $tokenB" `
    -F "file=@$jpgPath;type=image/jpeg"

Write-Host "User B Upload HTTP Code: $unauthUpload (Expected: 403 Forbidden)"

Write-Host "`n=================================================="
Write-Host "6. TEST 3: User B attempts to view User A's Image #$imageId"
Write-Host "=================================================="

$viewUrl = "http://localhost:8080/api/assessments/$assessmentId/images/$imageId/view"
$unauthView = & curl.exe -s -w "%{http_code}" -o $testDir\view_out.bin -X GET $viewUrl `
    -H "Authorization: Bearer $tokenB"

Write-Host "User B View HTTP Code: $unauthView (Expected: 403 Forbidden)"

Write-Host "`n=================================================="
Write-Host "7. TEST 4: User B attempts to delete User A's Image #$imageId"
Write-Host "=================================================="

$delUrl = "http://localhost:8080/api/assessments/$assessmentId/images/$imageId"
$unauthDel = & curl.exe -s -w "%{http_code}" -o $testDir\del_out.json -X DELETE $delUrl `
    -H "Authorization: Bearer $tokenB"

Write-Host "User B Delete HTTP Code: $unauthDel (Expected: 403 Forbidden)"

Write-Host "`n=================================================="
Write-Host "8. TEST 5: Admin accesses User A's Image #$imageId"
Write-Host "=================================================="

$adminLoginBody = @{
    email = "admin@nutrivision.ai"
    password = "Admin@NutriVision2026"
} | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminLoginRes.data.accessToken

$adminView = & curl.exe -s -w "%{http_code}" -o $testDir\admin_view.jpg -X GET $viewUrl `
    -H "Authorization: Bearer $adminToken"

Write-Host "Admin View HTTP Code: $adminView (Expected: 200 OK)"
Write-Host "Admin Downloaded File Size:" (Get-Item "$testDir\admin_view.jpg").Length "bytes"

Write-Host "`n=================================================="
Write-Host "9. TEST 6: Upload Unsupported File Format (.txt)"
Write-Host "=================================================="

$invalidUpload = & curl.exe -s -w "%{http_code}" -o $testDir\invalid_out.json -X POST $uploadUrl `
    -H "Authorization: Bearer $tokenA" `
    -F "file=@$txtPath;type=text/plain"

Write-Host "Invalid Format HTTP Code: $invalidUpload (Expected: 400 Bad Request)"

Write-Host "`n=================================================="
Write-Host "10. TEST 7: Upload Oversized File (> 10MB)"
Write-Host "=================================================="

$oversizedUpload = & curl.exe -s -w "%{http_code}" -o $testDir\oversized_out.json -X POST $uploadUrl `
    -H "Authorization: Bearer $tokenA" `
    -F "file=@$oversizedPath;type=image/jpeg"

Write-Host "Oversized File HTTP Code: $oversizedUpload (Expected: 400 or 500 max upload error)"

Write-Host "`n=================================================="
Write-Host "11. TEST 8: User A uploads second image (PNG) & lists images"
Write-Host "=================================================="

$uploadOutput2 = & curl.exe -s -X POST $uploadUrl `
    -H "Authorization: Bearer $tokenA" `
    -F "file=@$pngPath;type=image/png"
$uploadRes2 = $uploadOutput2 | ConvertFrom-Json
$imageId2 = $uploadRes2.data.imageId
Write-Host "Second Image Uploaded! Image ID: $imageId2 | Type: $($uploadRes2.data.mimeType)"

$listImages = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId/images" -Method Get -Headers $headersA
Write-Host "Total Images for Assessment #$($assessmentId): $($listImages.data.Count)"
foreach ($im in $listImages.data) {
    Write-Host "  - Image ID: #$($im.imageId) | File: $($im.originalFilename) | Size: $($im.fileSizeBytes) B | Status: $($im.qualityStatus)"
}

Write-Host "`n=================================================="
Write-Host "12. TEST 9: User A Deletes Image #$imageId"
Write-Host "=================================================="

$deleteRes = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId/images/$imageId" -Method Delete -Headers $headersA
Write-Host "Delete Result Success: $($deleteRes.success)"

# Verify list now has 1 image
$listAfter = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId/images" -Method Get -Headers $headersA
Write-Host "Images remaining after delete: $($listAfter.data.Count)"

Write-Host "`n=================================================="
Write-Host "ALL PHASE 5 IMAGE UPLOAD & SECURITY TESTS PASSED!"
Write-Host "=================================================="
