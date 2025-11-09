using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.Psikologi
{
    public class PsikologiReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public UserInfoDto User { get; set; } = null!;
    }

    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}

