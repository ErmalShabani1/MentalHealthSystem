using System;

namespace MentalHealthSystemManagement.Application.DTOs.Ushtrimet
{
    public class UshtrimiDto
    {
        public string Titulli { get; set; } = string.Empty;
        public string Pershkrimi { get; set; } = string.Empty;

        public int PsikologId { get; set; }
        public int? PatientId { get; set; }
    }
}
