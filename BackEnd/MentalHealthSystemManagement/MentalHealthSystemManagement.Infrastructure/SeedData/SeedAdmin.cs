using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using BCrypt.Net;

namespace MentalHealthSystemManagement.Infrastructure.SeedData
{
    public static class SeedAdmin
    {
        public static void AddAdmin(ApplicationDbContext context)
        {
            if (!context.Users.Any(u => u.Email == "admin@icloud.com"))
            {
                var admin = new User
                {
                    Username = "Admin",
                    Email = "admin@icloud.com",
                    Role = "Admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123")
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }
}