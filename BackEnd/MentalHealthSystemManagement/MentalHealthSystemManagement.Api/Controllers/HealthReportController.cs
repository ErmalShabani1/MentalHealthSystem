using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.DTOs.HealthReports;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Psikolog, Patient")]
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
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> AddReport([FromBody] CreateHealthReportDto dto)
        {
            try
            {
                await _service.AddReportAsync(dto);
                return Ok("Report added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
        [HttpGet("get-all")]
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
