using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;
using API.Middleware;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.RequestHelpers;

var builder = WebApplication.CreateBuilder(args);



builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("Cloudinary"));

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
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173", "https://restore-austin.azurewebsites.net")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Add ExceptionMiddleware to the dependency injection container
builder.Services.AddTransient<ExceptionMiddleware>();

// Add PaymentsService to the dependency injection container
// This service is responsible for handling payments through Stripe
// It is scoped to the request, so it can be used throughout the request lifecycle
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ImageService>();

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    opt.SignIn.RequireConfirmedEmail = false;
}).AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>()
.AddSignInManager<SignInManager<User>>();

// Configure Identity to allow login with email
builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;
});


var app = builder.Build();


app.UseDeveloperExceptionPage();

app.UseMiddleware<ExceptionMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowFrontend");
// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); //api/identity

app.MapFallbackToController("Index", "Fallback");

await DbInitializer.InitDb(app);

app.Run();
