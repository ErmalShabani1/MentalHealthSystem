using System;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("db")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckDatabase()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                return Ok(new
                {
                    status = canConnect ? "ok" : "unavailable",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}
