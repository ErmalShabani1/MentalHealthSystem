using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.Pacienti
{
    public class PatientReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Emri { get; set; } = string.Empty;
        public string Mbiemri { get; set; } = string.Empty;
        public int Mosha { get; set; }
        public string Gjinia { get; set; } = string.Empty;
        public string Diagnoza { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
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

