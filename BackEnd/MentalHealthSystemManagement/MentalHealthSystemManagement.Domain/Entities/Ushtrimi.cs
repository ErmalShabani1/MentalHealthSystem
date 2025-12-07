using System;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class Ushtrimi
    {
        public int Id { get; set; }

        public string Titulli { get; set; } = string.Empty;
        public string Pershkrimi { get; set; } = string.Empty;

        public DateTime DataKrijimit { get; set; } = DateTime.Now;


        public int PsikologId { get; set; }
        public Psikologi Psikolog { get; set; } = null!;


        public ICollection<TreatmentPlanUshtrimi> TreatmentPlanUshtrimet { get; set; }
         = new List<TreatmentPlanUshtrimi>();
    }
}
