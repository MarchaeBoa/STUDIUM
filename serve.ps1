$root = "C:\Users\Willia\Desktop\STUDIUM"
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Studium dev server running at http://localhost:$port"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root $path.TrimStart("/").Replace("/", "\")
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $ct = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".svg"  { "image/svg+xml" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".gif"  { "image/gif" }
            ".ico"  { "image/x-icon" }
            ".json" { "application/json" }
            ".woff2" { "font/woff2" }
            ".woff" { "font/woff" }
            default { "application/octet-stream" }
        }
        $ctx.Response.ContentType = $ct
        $ctx.Response.Headers.Add("Cache-Control", "no-cache")
        $ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*")
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
}
