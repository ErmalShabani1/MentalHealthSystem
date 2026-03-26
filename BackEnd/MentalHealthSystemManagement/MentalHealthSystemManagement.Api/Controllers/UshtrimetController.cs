using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;
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
    public class UshtrimetController : ControllerBase
    {
        private readonly UshtrimiService _service;
        private readonly ApplicationDbContext _context;

        public UshtrimetController(UshtrimiService service,ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }

        private async Task<int?> ResolvePatientIdAsync()
        {
            var patientIdClaim = User.FindFirst("PatientId")?.Value;
            if (int.TryParse(patientIdClaim, out var patientIdFromClaim))
            {
                return patientIdFromClaim;
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                var patient = await _context.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId);
                return patient?.Id;
            }

            return null;
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Psikolog")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("psikolog/{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> GetByPsikolog(int id)
        {
            var list = await _service.GetByPsikologIdAsync(id);
            return Ok(list);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Psikolog,Admin,Pacient")]
        public async Task<IActionResult> GetById(int id)
        {
            var ushtrimi = await _service.GetByIdAsync(id);
            if (ushtrimi == null) return NotFound("Ushtrimi nuk u gjet");
            return Ok(ushtrimi);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> Add([FromBody] UshtrimiDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok("Ushtrimi u shtua me sukses");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UshtrimiDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok("Ushtrimi u perditesua me sukses");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Ushtrimi u fshi me sukses");
        }
        [HttpGet("for-patient")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetForPatient()
        {
            try
            {
                var patientId = await ResolvePatientIdAsync();
                if (!patientId.HasValue)
                {
                    return Unauthorized("Pacienti nuk u gjet për këtë përdorues");
                }

                var allUshtrimet = await _service.GetAllAsync();

                var filteredUshtrimet = allUshtrimet
                    .Select(u => new UshtrimiReadDto
                    {
                        Id = u.Id,
                        Titulli = u.Titulli,
                        Pershkrimi = u.Pershkrimi,
                        DataKrijimit = u.DataKrijimit,
                        PsikologId = u.PsikologId,
                    })
                    .ToList();

                return Ok(filteredUshtrimet);
            }
            catch (Exception ex)
            {
                return BadRequest($"Gabim: {ex.Message}");
            }
        }

    }
}
 

