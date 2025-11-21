using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UshtrimetController : ControllerBase
    {
        private readonly UshtrimService _service;

        public UshtrimetController(UshtrimService service)
        {
            _service = service;
        }

        [HttpGet("psikolog/{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetByPsikolog(int id)
        {
            var ushtrimet = await _service.GetUshtrimetByPsikolog(id);
            return Ok(ushtrimet);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> AddUshtrim([FromBody] UshtrimDto dto)
        {
            try
            {
                var ushtrim = new Ushtrimi
                {
                    PsikologId = dto.PsikologId,
                    PatientId = dto.PatientId,
                    PatientName = dto.PatientName,
                    Title = dto.Title,
                    Description = dto.Description ?? string.Empty,
                    DueDate = dto.DueDate,
                    Notes = dto.Notes ?? string.Empty,
                    Status = "Assigned"
                };

                await _service.CreateUshtrim(ushtrim);
                return Ok("Ushtrimi u shtua me sukses");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> UpdateUshtrim(int id, Ushtrimi ushtrim)
        {
            if (id != ushtrim.Id)
                return BadRequest("Id nuk është i njëjtë");

            await _service.UpdateAsync(ushtrim);
            return Ok("Ushtrimi u përditësua me sukses");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> DeleteUshtrim(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Ushtrimi u fshi me sukses");
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var ushtrimet = await _service.GetAllUshtrimetAsync();
            return Ok(ushtrimet);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ushtrim = await _service.GetUshtrimById(id);
            if (ushtrim == null)
                return BadRequest("Id nuk u gjet");

            return Ok(ushtrim);
        }
    }
}
