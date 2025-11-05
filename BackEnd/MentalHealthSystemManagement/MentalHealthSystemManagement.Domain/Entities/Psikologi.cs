using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class Psikologi
    {
        public int Id{ get; set; }
        public int UserId { get;set; }
        public string Name { get;set; }
        public string Surname { get;set; }
        public string Specialization { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;

        public User User { get; set; } = null!;
    }
}
