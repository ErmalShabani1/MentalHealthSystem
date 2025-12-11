using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace MentalHealthSystemManagement.Application.DTOs.News
{
    public class CreateNewsDto
    {
        public string Description {  get; set; }
        public IFormFile Image { get; set; }
    }
}
