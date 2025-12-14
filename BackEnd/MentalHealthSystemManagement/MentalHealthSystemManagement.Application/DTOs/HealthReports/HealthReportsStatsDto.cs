using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.HealthReports
{
    public class HealthReportStatsDto
    {
        public int TotalReports { get; set; }
        public int ThisMonthReports { get; set; }
        public Dictionary<string, int> ReportsByDiagnosis { get; set; }
        public Dictionary<string, int> ReportsByPsikolog { get; set; }
    }

}
