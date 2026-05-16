# setup_microservices.ps1
# Script tạo tự động cấu trúc thư mục Microservices cho dự án Smart Medicine Shop

Write-Host "Bắt đầu tạo cấu trúc thư mục Microservices..." -ForegroundColor Cyan

$services = @("api-gateway", "user-service", "product-service", "order-service", "ai-service")

foreach ($service in $services) {
    if (-Not (Test-Path -Path $service)) {
        New-Item -ItemType Directory -Path $service | Out-Null
        Write-Host "Đã tạo thư mục: $service" -ForegroundColor Green
    } else {
        Write-Host "Thư mục $service đã tồn tại." -ForegroundColor Yellow
    }
}

Write-Host "Khởi tạo thư mục thành công!" -ForegroundColor Cyan
