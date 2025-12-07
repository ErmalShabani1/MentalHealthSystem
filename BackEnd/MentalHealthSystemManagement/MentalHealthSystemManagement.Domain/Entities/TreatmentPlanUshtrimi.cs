using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class TreatmentPlanUshtrimi
    {
        public int TreatmentPlanUshtrimiId { get; set; }
        public int TreatmentPlanId { get; set; }
        public int UshtrimiId { get; set; }

        public TreatmentPlan? TreatmentPlan { get; set; }
        public Ushtrimi? Ushtrimi {get;set;}
    }
}
