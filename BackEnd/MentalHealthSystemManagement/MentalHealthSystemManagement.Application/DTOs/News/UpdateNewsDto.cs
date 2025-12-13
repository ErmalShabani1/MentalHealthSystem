using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.News
{
    public class UpdateNewsDto
    {
        public string Description { get; set; } = string.Empty;
        public IFormFile? Image { get; set; } 
    }
}
