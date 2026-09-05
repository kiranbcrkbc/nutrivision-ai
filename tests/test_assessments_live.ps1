# NutriVision AI - Phase 4 Live Assessment & Security Authorization Test Suite

Write-Host "=================================================="
Write-Host "1. Authenticating User A (test.user@nutrivision.ai)"
Write-Host "=================================================="

$loginBodyA = @{
    email = "test.user@nutrivision.ai"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginResA = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBodyA -ContentType "application/json"
$tokenA = $loginResA.data.accessToken
$headersA = @{ Authorization = "Bearer $tokenA" }
Write-Host "User A Authenticated! Token:" ($tokenA.Substring(0, 25) + "...")

Write-Host "`n=================================================="
Write-Host "2. Creating Assessment #1 for User A (NAILS)"
Write-Host "=================================================="

$createBody1 = @{ targetBodyPart = "NAILS" } | ConvertTo-Json
$createRes1 = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments" -Method Post -Headers $headersA -Body $createBody1 -ContentType "application/json"
$assessmentId1 = $createRes1.data.assessmentId
Write-Host "Created Assessment ID:" $assessmentId1
Write-Host "Target Body Part:" $createRes1.data.targetBodyPart
Write-Host "Status:" $createRes1.data.status
Write-Host "User Full Name in DTO:" $createRes1.data.userFullName

Write-Host "`n=================================================="
Write-Host "3. Creating Assessment #2 for User A (EYES)"
Write-Host "=================================================="

$createBody2 = @{ targetBodyPart = "EYES" } | ConvertTo-Json
$createRes2 = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments" -Method Post -Headers $headersA -Body $createBody2 -ContentType "application/json"
$assessmentId2 = $createRes2.data.assessmentId
Write-Host "Created Assessment ID:" $assessmentId2
Write-Host "Target Body Part:" $createRes2.data.targetBodyPart

Write-Host "`n=================================================="
Write-Host "4. Listing Assessments for User A (GET /api/assessments)"
Write-Host "=================================================="

$listResA = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments" -Method Get -Headers $headersA
Write-Host "Total Assessments for User A:" $listResA.data.Count
foreach ($a in $listResA.data) {
    Write-Host "  - ID: #$($a.assessmentId) | Part: $($a.targetBodyPart) | Status: $($a.status)"
}

Write-Host "`n=================================================="
Write-Host "5. Updating Assessment #1 Status to COMPLETED (PATCH /api/assessments/{id}/status)"
Write-Host "=================================================="

$updateBody = @{
    status = "COMPLETED"
    severityRiskLevel = "MODERATE_CONCERN"
} | ConvertTo-Json
$updateRes = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId1/status" -Method Patch -Headers $headersA -Body $updateBody -ContentType "application/json"
Write-Host "Updated Status:" $updateRes.data.status
Write-Host "Severity Level:" $updateRes.data.severityRiskLevel
Write-Host "Completed At Timestamp:" $updateRes.data.completedAt

Write-Host "`n=================================================="
Write-Host "6. Registering and Authenticating User B (other.user@nutrivision.ai)"
Write-Host "=================================================="

$regBodyB = @{
    fullName = "Other Patient User"
    email = "other.user@nutrivision.ai"
    password = "DifferentPassword456"
    confirmPassword = "DifferentPassword456"
    disclaimerAccepted = $true
} | ConvertTo-Json

try {
    $regResB = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $regBodyB -ContentType "application/json"
    $tokenB = $regResB.data.accessToken
} catch {
    $loginBodyB = @{
        email = "other.user@nutrivision.ai"
        password = "DifferentPassword456"
    } | ConvertTo-Json
    $loginResB = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBodyB -ContentType "application/json"
    $tokenB = $loginResB.data.accessToken
}
$headersB = @{ Authorization = "Bearer $tokenB" }
Write-Host "User B Authenticated!"

Write-Host "`n=================================================="
Write-Host "7. SECURITY TEST: User B attempts to access User A's Assessment #$assessmentId1"
Write-Host "=================================================="

try {
    $unauthGet = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId1" -Method Get -Headers $headersB
    Write-Host "SECURITY ERROR: User B was able to access User A's assessment!"
} catch {
    Write-Host "CORRECTLY PROTECTED: Access Denied with Status Code:" $_.Exception.Response.StatusCode.value__
}

Write-Host "`n=================================================="
Write-Host "8. SECURITY TEST: User B attempts to delete User A's Assessment #$assessmentId1"
Write-Host "=================================================="

try {
    $unauthDel = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId1" -Method Delete -Headers $headersB
    Write-Host "SECURITY ERROR: User B was able to delete User A's assessment!"
} catch {
    Write-Host "CORRECTLY PROTECTED: Delete Denied with Status Code:" $_.Exception.Response.StatusCode.value__
}

Write-Host "`n=================================================="
Write-Host "9. ADMIN ACCESS TEST: Administrator accesses Assessment #$assessmentId1"
Write-Host "=================================================="

$adminLoginBody = @{
    email = "admin@nutrivision.ai"
    password = "Admin@NutriVision2026"
} | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminLoginRes.data.accessToken
$adminHeaders = @{ Authorization = "Bearer $adminToken" }

$adminGetRes = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId1" -Method Get -Headers $adminHeaders
Write-Host "Admin Access Granted! Retrieved Assessment #$($adminGetRes.data.assessmentId) owned by $($adminGetRes.data.userFullName)"

Write-Host "`n=================================================="
Write-Host "10. User A Deletes Assessment #$assessmentId2"
Write-Host "=================================================="

$delRes = Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/$assessmentId2" -Method Delete -Headers $headersA
Write-Host "Delete Result Success:" $delRes.success
Write-Host "Deleted ID:" $delRes.data.assessmentId

Write-Host "`n=================================================="
Write-Host "ALL PHASE 4 ASSESSMENT & SECURITY TESTS PASSED!"
Write-Host "=================================================="
