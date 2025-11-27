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
                // Merr ID-në e USER-it nga token
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                // Gjej ID-në e pacientit nga userId
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null)
                {
                    return BadRequest("Pacienti nuk u gjet");
                }

                var patientId = patient.Id;

                // Merr të gjitha ushtrimet
                var allUshtrimet = await _service.GetAllAsync();

                // Filtro - përdor patientId nga tabela Patients
                var filteredUshtrimet = allUshtrimet
                    .Where(u => u.PatientId == null || u.PatientId == patientId)
                    .Select(u => new UshtrimiReadDto
                    {
                        Id = u.Id,
                        Titulli = u.Titulli,
                        Pershkrimi = u.Pershkrimi,
                        DataKrijimit = u.DataKrijimit,
                        PsikologId = u.PsikologId,
                        PatientId = u.PatientId
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
 

