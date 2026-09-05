$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body (@{email="test.user@nutrivision.ai";password="SecurePassword123"} | ConvertTo-Json) -ContentType "application/json"
$token = $loginRes.data.accessToken
$res = & curl.exe -s -X POST "http://localhost:8080/api/assessments/5/images" -H "Authorization: Bearer $token" -F "file=@tests\sample_images\valid_nail_sample.jpg;type=image/jpeg"
Write-Host "Response from server:" $res
