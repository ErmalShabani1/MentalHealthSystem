using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.Pacienti
{
    public class UpdatePatientDto
    {
        public string Emri { get; set; } = string.Empty;
        public string Mbiemri { get; set; } = string.Empty;
        public int Mosha { get; set; }
        public string Gjinia { get; set; } = string.Empty;
        public string Diagnoza { get; set; } = string.Empty;
    }
}
