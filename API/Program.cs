using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

app.UseDeveloperExceptionPage();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod().AllowCredentials()
       .WithOrigins("https://localhost:5173");
});
// Configure the HTTP request pipeline.
app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
