using System;

namespace MentalHealthSystemManagement.Application.DTOs.Ushtrimet
{
    public class UshtrimiReadDto
    {
        public int Id { get; set; }
        public string Titulli { get; set; } = string.Empty;
        public string Pershkrimi { get; set; } = string.Empty;
        public DateTime DataKrijimit { get; set; }

        public int PsikologId { get; set; }
       
    }
}
