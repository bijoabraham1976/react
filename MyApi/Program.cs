using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Use Pomelo EF Core with MySQL 8
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseStaticFiles(); // for wwwroot

// serve Photos folder explicitly
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
    RequestPath = "/Photos"
});

app.MapControllers();
app.MapGet("/", () => "Hello World!");  // Simple test endpoint for root
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.Run();
