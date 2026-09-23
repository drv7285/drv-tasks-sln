var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "."
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true
});

if (app.Environment.IsDevelopment())
{
    app.Run("http://localhost:5555");
}
else
{
    app.Run();
}
