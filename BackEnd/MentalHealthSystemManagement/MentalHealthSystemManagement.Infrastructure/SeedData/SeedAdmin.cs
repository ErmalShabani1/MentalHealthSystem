using System.Security.Cryptography;
using System.Text;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data; // nese DbContext eshte aty

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
                    PasswordHash = HashPassword("Admin123!")
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
