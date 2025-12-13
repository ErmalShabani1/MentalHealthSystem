using MentalHealthSystemManagement.Application.DTOs.HealthReports;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Psikolog, Pacient")]
    public class HealthReportController : ControllerBase
    {
        private readonly HealthReportService _service;
        private readonly ApplicationDbContext _context;

        public HealthReportController(HealthReportService service,ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }
        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> AddReport([FromBody] CreateHealthReportDto dto)
        {
            try
            {
                // Merr psikologId nga token direkt
                var psikologIdClaim = User.FindFirst("PsikologId")?.Value;
                if (string.IsNullOrEmpty(psikologIdClaim))
                    return BadRequest("PsikologId is missing in token");

                dto.PsikologId = int.Parse(psikologIdClaim);

                await _service.AddReportAsync(dto);
                return Ok("Report added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
        [HttpGet("get-all")]
        [Authorize(Roles = "Admin,Pacient,Psikolog")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var report = await _service.GetByIdAsync(id);
            if (report == null) return NotFound("Raporti nuk u gjet");
            return Ok(report);
        }
        [HttpGet("my-reports")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetMyReports()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var pacienti = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (pacienti == null)
                    return BadRequest("Pacienti nuk ekziston!");

                var raportet = await _service.GetByPatientIdAsync(pacienti.Id);
                return Ok(raportet);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("update/{id}")]
        [Authorize(Roles ="Psikolog")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateHealthReportDto dto)
        {
            await _service.UpdateReportAsync(id, dto);
            return Ok("Raporti u perditesua me sukses");
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="Psikolog")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Raporti u fshi me sukses");
        }
       
        
    }
}
