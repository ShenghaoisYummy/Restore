var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors();

var app = builder.Build();


app.UseCors(opt =>{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .WithOrigins("http://localhost:3000");
});
// Configure the HTTP request pipeline.
app.MapControllers();

app.Run();
