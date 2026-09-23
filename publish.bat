@echo off
chcp 65001 > nul
setlocal
echo ========================================================
echo   DRV TASKS - 1-CLICK PUBLISH TO IIS (192.168.1.32)
echo ========================================================
echo.

set "ROOT=X:\acc\drv\slns\drv-tasks-sln"
set "PROJ=%ROOT%\drv-tasks-site.csproj"
set "USERFILE=%ROOT%\Properties\PublishProfiles\IISProfile.pubxml.user"
set "MSBUILD=C:\Program Files\Microsoft Visual Studio\18\Enterprise\MSBuild\Current\Bin\MSBuild.exe"

if not exist "%MSBUILD%" (
    echo [ERROR] Khong tim thay MSBuild tai duong dan Visual Studio 18.
    pause
    exit /b 1
)

echo [1/3] Dang lay mat khau deploy tu EncryptedPassword...
rem Giai ma bang DPAPI ngay luc chay - khong luu mat khau dang plaintext o bat ky dau.
set "DEPLOYPWD="
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "Add-Type -AssemblyName System.Security; $x=[xml](Get-Content -LiteralPath '%USERFILE%'); [Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String($x.Project.PropertyGroup.EncryptedPassword),$null,'CurrentUser'))"`) do set "DEPLOYPWD=%%P"

if not defined DEPLOYPWD (
    echo [ERROR] Khong giai ma duoc mat khau trong IISProfile.pubxml.user
    echo         Mo Publish trong Visual Studio, nhap lai mat khau va tick Save password.
    pause
    exit /b 1
)

echo [2/3] Dang build Release va publish len IIS server 192.168.1.32...
"%MSBUILD%" "%PROJ%" /t:Build /p:DeployOnBuild=true /p:PublishProfile=IISProfile /p:Configuration=Release /p:Password=%DEPLOYPWD% /p:LaunchSiteAfterPublish=false /v:m
set "RC=%ERRORLEVEL%"

if not "%RC%"=="0" (
    echo.
    echo [THAT BAI] Co loi trong qua trinh Publish. Vui long kiem tra log o tren.
    pause
    exit /b %RC%
)

echo.
echo [3/3] Dang kiem tra site sau khi publish...
rem Kiem tra: trang chinh phai 200, file build phai 404 (bi requestFiltering chan).
powershell -NoProfile -Command "$ok=$true; foreach($t in @(@{u='http://14.224.163.154:5555/';e=200},@{u='http://14.224.163.154:5555/tasks/2026/09/PQ-SDT-KH/index.html';e=200},@{u='http://14.224.163.154:5555/drv-tasks-site.dll';e=404})){ try{ $c=(Invoke-WebRequest -Uri $t.u -UseBasicParsing -TimeoutSec 15).StatusCode }catch{ $c=if($_.Exception.Response){[int]$_.Exception.Response.StatusCode}else{0} }; if($c -ne $t.e){$ok=$false}; Write-Host ('  {0,-62} {1} (mong doi {2})' -f $t.u,$c,$t.e) }; if(-not $ok){ Write-Host '  [CANH BAO] Site khong dung trang thai mong doi!' -ForegroundColor Red; exit 1 }"
set "RC=%ERRORLEVEL%"

echo.
if "%RC%"=="0" (
    echo ========================================================
    echo   [THANH CONG] Website da duoc cap nhat len IIS!
    echo   Link: http://14.224.163.154:5555/tasks/2026/09/PQ-SDT-KH/
    echo ========================================================
) else (
    echo ========================================================
    echo   [CANH BAO] Publish xong nhung site kiem tra khong dat.
    echo   Kiem tra lai web.config tren server.
    echo ========================================================
)

echo.
pause
exit /b %RC%
