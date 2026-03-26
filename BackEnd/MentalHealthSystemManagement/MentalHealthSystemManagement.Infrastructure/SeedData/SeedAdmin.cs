using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;

namespace MentalHealthSystemManagement.Infrastructure.SeedData
{
    public static class SeedAdmin
    {
        private const string DefaultAdminEmail = "admin@icloud.com";
        private const string DefaultAdminPassword = "Admin123";
        private const string DefaultAdminUsername = "Admin";
        private const string DefaultRole = "Admin";

        public static void AddAdmin(ApplicationDbContext context)
        {
            if (!context.Users.Any(u => u.Email == DefaultAdminEmail))
            {
                var admin = new User
                {
                    Username = DefaultAdminUsername,
                    Email = DefaultAdminEmail,
                    Role = DefaultRole,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultAdminPassword)
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }
        }

        public static void EnsureCredentials(ApplicationDbContext context, string email, string password, string username)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            var resolvedUsername = string.IsNullOrWhiteSpace(username) ? DefaultAdminUsername : username;
            var user = context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                user = new User
                {
                    Username = resolvedUsername,
                    Email = email,
                    Role = DefaultRole
                };
                context.Users.Add(user);
            }
            else
            {
                user.Username = resolvedUsername;
                user.Role = DefaultRole;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            context.SaveChanges();
        }
    }
}