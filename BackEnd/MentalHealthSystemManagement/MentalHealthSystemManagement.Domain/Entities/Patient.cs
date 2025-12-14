using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class Patient 
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Emri { get; set; }
        public string Mbiemri { get; set; } 
        public int Mosha { get; set; }
        public string Gjinia { get; set; }
        public string Diagnoza { get; set; }
        public bool IsDeleted { get; set; }

        public User User { get; set; }
    }
}
