using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.TreatmentPlan
{
    public class TreatmentPlanUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = "OnHold";
        public string Goals { get; set; } = string.Empty;

    }
}
