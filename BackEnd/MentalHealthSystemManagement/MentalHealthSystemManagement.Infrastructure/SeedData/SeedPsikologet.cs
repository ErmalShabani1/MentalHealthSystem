using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using BCrypt.Net;

namespace MentalHealthSystemManagement.Infrastructure.SeedData
{
    public static class SeedPsikologet
    {
        public static void AddPsikologet(ApplicationDbContext context)
        {
            // Check if psychologists already exist
            if (context.Psikologet.Any())
            {
                return; // Already seeded
            }

            var psikologet = new[]
            {
                new
                {
                    Username = "dr.ardit.krasniqi",
                    Email = "ardit.krasniqi@mentalhealth.ks",
                    Password = "Psikolog123",
                    Name = "Ardit",
                    Surname = "Krasniqi",
                    Specialization = "Psikologji Klinike dhe Terapi Kognitive-Comportamentale",
                    ExperienceLevel = "Ekspert (15+ vjet përvojë)"
                },
                new
                {
                    Username = "dr.blerta.berisha",
                    Email = "blerta.berisha@mentalhealth.ks",
                    Password = "Psikolog123",
                    Name = "Blerta",
                    Surname = "Berisha",
                    Specialization = "Psikologji e Fëmijëve dhe Adoleshentëve",
                    ExperienceLevel = "Senior (10+ vjet përvojë)"
                },
                new
                {
                    Username = "dr.driton.morina",
                    Email = "driton.morina@mentalhealth.ks",
                    Password = "Psikolog123",
                    Name = "Driton",
                    Surname = "Morina",
                    Specialization = "Psikologji Familjare dhe Çiftëzore",
                    ExperienceLevel = "Ekspert (12+ vjet përvojë)"
                },
                new
                {
                    Username = "dr.ela.hoxha",
                    Email = "ela.hoxha@mentalhealth.ks",
                    Password = "Psikolog123",
                    Name = "Ela",
                    Surname = "Hoxha",
                    Specialization = "Trauma dhe PTSD - Terapi EMDR",
                    ExperienceLevel = "Ekspert (14+ vjet përvojë)"
                },
                new
                {
                    Username = "dr.gentrit.bytyqi",
                    Email = "gentrit.bytyqi@mentalhealth.ks",
                    Password = "Psikolog123",
                    Name = "Gentrit",
                    Surname = "Bytyqi",
                    Specialization = "Psikologji Organizative dhe Këshillim Karriere",
                    ExperienceLevel = "Senior (8+ vjet përvojë)"
                }
            };

            foreach (var psikologData in psikologet)
            {
                // Check if user already exists
                if (!context.Users.Any(u => u.Email == psikologData.Email))
                {
                    var user = new User
                    {
                        Username = psikologData.Username,
                        Email = psikologData.Email,
                        Role = "Psikolog",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(psikologData.Password)
                    };

                    context.Users.Add(user);
                    context.SaveChanges();

                    var psikolog = new Psikologi
                    {
                        UserId = user.Id,
                        Name = psikologData.Name,
                        Surname = psikologData.Surname,
                        Specialization = psikologData.Specialization,
                        ExperienceLevel = psikologData.ExperienceLevel
                    };

                    context.Psikologet.Add(psikolog);
                }
            }

            context.SaveChanges();
        }
    }
}

