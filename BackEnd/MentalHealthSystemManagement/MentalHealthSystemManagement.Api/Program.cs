using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using MentalHealthSystemManagement.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.Extensions.FileProviders; // Shto këtë
using System.IO; // Shto këtë

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Shto CORS për React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Dependency injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IPsikologRepository, PsikologRepository>();
builder.Services.AddScoped<PsikologService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<IHealthReportRepository, HealthReportRepository>();
builder.Services.AddScoped<HealthReportService>();
builder.Services.AddScoped<ITherapySessionRepository, TherapySessionRepository>();
builder.Services.AddScoped<TherapySessionService>();
builder.Services.AddScoped<ITreatmentPlanRepository, TreatmentPlanRepository>();
builder.Services.AddScoped<TreatmentPlanService>();
builder.Services.AddScoped<IUshtrimiRepository, UshtrimiRepository>();
builder.Services.AddScoped<UshtrimiService>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();
builder.Services.AddScoped<NewsService>();

var jwtSecret = builder.Configuration["Jwt:Key"] ?? "Kjo_eshte_nje_celes_shume_sekret_per_JWT_256bit";
builder.Services.AddSingleton(new JwtService(builder.Configuration));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("jwt"))
                {
                    context.Token = context.Request.Cookies["jwt"];
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// KRIJO FOLDERIN newsImages NËSE NUK EKZISTON
var newsImagesPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "newsImages");
if (!Directory.Exists(newsImagesPath))
{
    Directory.CreateDirectory(newsImagesPath);
    Console.WriteLine($"✅ Folderi 'newsImages' u krijua në: {newsImagesPath}");
}

// GJITHASHTU KRIJO FOLDERIN uploads PËR RASET E TË TILA
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    Console.WriteLine($"✅ Folderi 'uploads' u krijua në: {uploadsPath}");
}

// Seed admin data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    MentalHealthSystemManagement.Infrastructure.SeedData.SeedAdmin.AddAdmin(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Aktivizo CORS
app.UseCors("AllowReactApp");

// ✅ KONFIGURO STATIC FILES PËR TË GJITHA FOLDERAT
app.UseStaticFiles(); // Për wwwroot

// Për folderin newsImages
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(newsImagesPath),
    RequestPath = "/newsImages",
    ServeUnknownFileTypes = true,
    DefaultContentType = "image/webp" // Specifikoni content type për webp
});

// Kjo për të lejuar të gjitha llojet e imazheve
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "wwwroot")),
    RequestPath = "",
    ServeUnknownFileTypes = true,
    OnPrepareResponse = ctx =>
    {
        // Lejo cache për imazhet
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=3600");
    }
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();