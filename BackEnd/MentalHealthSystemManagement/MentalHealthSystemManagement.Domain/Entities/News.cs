using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class News
    {
        public int Id { get; set; }
        public int PsikologId {  get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt {  get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("PsikologId")]
        public Psikologi Psikologu { get; set; } 
    }
}
