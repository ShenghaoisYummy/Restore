using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;
using API.Middleware;
using API.Entities;
using Microsoft.AspNetCore.Identity;
var builder = WebApplication.CreateBuilder(args);

// Add MVC controllers to the dependency injection container.
// This enables the application to handle HTTP requests through controller actions.
// Controllers contain action methods that define API endpoints for handling client requests.

builder.Services.AddControllers();


// Add Entity Framework DbContext to the dependency injection container
// This configures the database context (StoreContext) to use SQLite as the database provider
// The connection string is retrieved from the application configuration (appsettings.json)
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


// Add Cors to the dependency injection container
builder.Services.AddCors();

// Add ExceptionMiddleware to the dependency injection container
builder.Services.AddTransient<ExceptionMiddleware>();

// Add PaymentsService to the dependency injection container
// This service is responsible for handling payments through Stripe
// It is scoped to the request, so it can be used throughout the request lifecycle
builder.Services.AddScoped<PaymentsService>();

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>();


var app = builder.Build();


app.UseDeveloperExceptionPage();

app.UseMiddleware<ExceptionMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod().AllowCredentials()
       .WithOrigins("https://localhost:5173");
});
// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); //api/identity

app.MapFallbackToController("Index", "Fallback");

await DbInitializer.InitDb(app);

app.Run();
