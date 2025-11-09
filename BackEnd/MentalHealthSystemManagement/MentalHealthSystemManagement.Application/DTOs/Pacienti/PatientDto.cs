using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.Pacienti
{
    public class PatientDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Emri { get; set; } = string.Empty;
        public string Mbiemri { get; set; } = string.Empty;
        public int Mosha { get; set; }
        public string Gjinia { get; set; } = string.Empty;
        public string Diagnoza { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
    }
}
