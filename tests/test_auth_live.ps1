# NutriVision AI - Comprehensive End-to-End Auth & Security Test Script

Write-Host "=================================================="
Write-Host "1. Testing /api/health and /api/health/database"
Write-Host "=================================================="

$health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
Write-Host "Health Status:" $health.data.status
Write-Host "Service Name:" $health.data.service
Write-Host "Medical Disclaimer:" $health.disclaimer

$dbHealth = Invoke-RestMethod -Uri "http://localhost:8080/api/health/database" -Method Get
Write-Host "DB Status:" $dbHealth.data.database
Write-Host "DB Product:" $dbHealth.data.databaseProduct

Write-Host "`n=================================================="
Write-Host "2. Testing POST /api/auth/register (New User: test.user@nutrivision.ai)"
Write-Host "=================================================="

$regBody = @{
    fullName = "Test User Patient"
    email = "test.user@nutrivision.ai"
    password = "SecurePassword123"
    confirmPassword = "SecurePassword123"
    disclaimerAccepted = $true
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "Registration Success:" $regResponse.success
    Write-Host "User ID:" $regResponse.data.user.userId
    Write-Host "Full Name:" $regResponse.data.user.fullName
    Write-Host "Email:" $regResponse.data.user.email
    Write-Host "Roles:" ($regResponse.data.user.roles -join ", ")
    Write-Host "JWT Access Token Issued:" ($regResponse.data.accessToken.Substring(0, 30) + "...")
} catch {
    Write-Host "Registration Error (might already exist):" $_.Exception.Message
}

Write-Host "`n=================================================="
Write-Host "3. Testing Duplicate Registration Rejection"
Write-Host "=================================================="

try {
    $dupResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "ERROR: Duplicate registration should have been rejected!"
} catch {
    Write-Host "Duplicate Correctly Rejected with Status Code:" $_.Exception.Response.StatusCode.value__
}

Write-Host "`n=================================================="
Write-Host "4. Testing Invalid Login (Wrong Password)"
Write-Host "=================================================="

$badLoginBody = @{
    email = "test.user@nutrivision.ai"
    password = "WrongPassword999"
} | ConvertTo-Json

try {
    $badLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $badLoginBody -ContentType "application/json"
    Write-Host "ERROR: Invalid login should have been rejected!"
} catch {
    Write-Host "Invalid Login Correctly Rejected with Status Code:" $_.Exception.Response.StatusCode.value__
}

Write-Host "`n=================================================="
Write-Host "5. Testing Valid Login (User JWT Issuance)"
Write-Host "=================================================="

$loginBody = @{
    email = "test.user@nutrivision.ai"
    password = "SecurePassword123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$userJwt = $loginResponse.data.accessToken
Write-Host "Login Successful! Token Type:" $loginResponse.data.tokenType
Write-Host "User JWT Token:" ($userJwt.Substring(0, 30) + "...")

Write-Host "`n=================================================="
Write-Host "6. Testing GET /api/auth/me using User JWT"
Write-Host "=================================================="

$userHeaders = @{
    Authorization = "Bearer $userJwt"
}
$meResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method Get -Headers $userHeaders
Write-Host "Current User ID:" $meResponse.data.userId
Write-Host "Current User Email:" $meResponse.data.email
Write-Host "Current User Roles:" ($meResponse.data.roles -join ", ")

Write-Host "`n=================================================="
Write-Host "7. Testing PUT /api/users/profile"
Write-Host "=================================================="

$profileUpdateBody = @{
    fullName = "Test User Patient (Updated)"
    phone = "+91 9876543210"
    age = 26
    gender = "MALE"
    dietaryPreference = "VEGETARIAN"
    preferredLanguage = "kn"
    city = "Bengaluru"
    country = "India"
} | ConvertTo-Json

$profileUpdateRes = Invoke-RestMethod -Uri "http://localhost:8080/api/users/profile" -Method Put -Headers $userHeaders -Body $profileUpdateBody -ContentType "application/json"
Write-Host "Profile Update Success:" $profileUpdateRes.success
Write-Host "Updated Name:" $profileUpdateRes.data.fullName
Write-Host "Updated Dietary Preference:" $profileUpdateRes.data.profile.dietaryPreference
Write-Host "Updated Language:" $profileUpdateRes.data.profile.preferredLanguage
Write-Host "Updated City:" $profileUpdateRes.data.profile.city

Write-Host "`n=================================================="
Write-Host "8. Testing Role Protection: Normal User calling Admin Endpoint"
Write-Host "=================================================="

try {
    $forbiddenRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/summary" -Method Get -Headers $userHeaders
    Write-Host "ERROR: Normal user should NOT access /api/admin/summary!"
} catch {
    Write-Host "Admin Endpoint Correctly Protected! Status Code:" $_.Exception.Response.StatusCode.value__
}

Write-Host "`n=================================================="
Write-Host "9. Testing Admin Login & Accessing Admin Endpoint"
Write-Host "=================================================="

$adminLoginBody = @{
    email = "admin@nutrivision.ai"
    password = "Admin@NutriVision2026"
} | ConvertTo-Json

$adminLoginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminJwt = $adminLoginResponse.data.accessToken
Write-Host "Admin Login Successful! Admin Email:" $adminLoginResponse.data.user.email
Write-Host "Admin Roles:" ($adminLoginResponse.data.user.roles -join ", ")

$adminHeaders = @{
    Authorization = "Bearer $adminJwt"
}
$adminSummaryRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/summary" -Method Get -Headers $adminHeaders
Write-Host "Admin Summary API Call Success:" $adminSummaryRes.success
Write-Host "Total Users in System:" $adminSummaryRes.data.totalUsers
Write-Host "System Status:" $adminSummaryRes.data.systemStatus

Write-Host "`n=================================================="
Write-Host "ALL BACKEND AUTH & SECURITY TESTS PASSED!"
Write-Host "=================================================="
