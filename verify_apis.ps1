$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param([string]$Name, [string]$Url, [string]$Method = "Get")
    try {
        if ($Name -eq "Login") {
            $body = ConvertTo-Json @{email='admin@crms.edu';password='password123'}
            $response = Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json' -Body $body
            $global:token = $response.accessToken
            $global:headers = @{Authorization="Bearer $global:token"}
            Write-Host "[PASS] $Name" -ForegroundColor Green
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $global:headers
            Write-Host "[PASS] $Name" -ForegroundColor Green
        }
    } catch {
        Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
    }
}

Write-Host "=== API Verification ==="

Test-Endpoint "Actuator Health" "http://localhost:8080/actuator/health"
Test-Endpoint "Login" "http://localhost:8080/api/v1/auth/login"

$endpoints = @{
    "Conflicts" = "conflicts"
    "Routines" = "routines"
    "Substitutes" = "substitutes"
    "Dashboard Stats" = "dashboard/stats"
    "Reference Data" = "reference-data"
    "Teachers" = "teachers"
    "Subjects" = "subjects"
    "Classes" = "classes"
    "Classrooms" = "classrooms"
    "TimeSlots" = "time-slots"
    "Users" = "users"
    "Audit Logs" = "audit-logs"
    "Notifications" = "notifications"
    "Holidays" = "calendar/holidays"
    "Lessons" = "lessons"
    "Departments" = "departments"
}

foreach ($e in $endpoints.GetEnumerator()) {
    Test-Endpoint $e.Name "http://localhost:8080/api/v1/$($e.Value)"
}
