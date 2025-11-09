using MentalHealthSystemManagement.Application.DTOs.Pacienti;
using MentalHealthSystemManagement.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentalHealthSystemManagement.Domain.Entities;
using System.Linq;
namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Psikolog")]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _patientService;
        public PatientController(PatientService patientService)
        {
            _patientService = patientService;
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddPatient([FromBody] PatientDto dto)
        {
            try
            {
                await _patientService.AddPatientAsync(
                    dto.Username, dto.Email, dto.Password,
                    dto.Emri, dto.Mbiemri, dto.Mosha, dto.Gjinia, dto.Diagnoza, dto.IsDeleted
                );

                return Ok("Pacienti u shtua me sukses!");
            }
            catch (Exception ex)
            {
                // Kthen gabimin në mënyrë që ta shohim në browser / Postman
                return StatusCode(500, $"Gabim i brendshëm: {ex.Message}");
            }
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Debug: Check if user is authenticated and what role they have
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized("User is not authenticated");
                }

                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                if (string.IsNullOrEmpty(userRole))
                {
                    return Unauthorized("User role not found in token");
                }

                var list = await _patientService.GetAllAsync();
                if (list == null)
                {
                    return Ok(new List<PatientReadDto>());
                }

                var result = list.Select(p => new PatientReadDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Emri = p.Emri ?? string.Empty,
                    Mbiemri = p.Mbiemri ?? string.Empty,
                    Mosha = p.Mosha,
                    Gjinia = p.Gjinia ?? string.Empty,
                    Diagnoza = p.Diagnoza ?? string.Empty,
                    IsDeleted = p.IsDeleted,
                    User = p.User != null ? new UserInfoDto
                    {
                        Id = p.User.Id,
                        Username = p.User.Username ?? string.Empty,
                        Email = p.User.Email ?? string.Empty,
                        Role = p.User.Role ?? string.Empty
                    } : new UserInfoDto { Id = p.UserId, Username = "N/A", Email = "N/A", Role = "N/A" }
                }).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the full exception for debugging
                return StatusCode(500, $"Gabim i brendshëm: {ex.Message}. StackTrace: {ex.StackTrace}");
            }
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
        {
            await _patientService.UpdateAsync(id, dto.Emri, dto.Mbiemri, dto.Mosha, dto.Gjinia, dto.Diagnoza);
            return Ok("Pacienti updated me sukses");
        }
        [HttpDelete("{id}")]
      public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var patient = await _patientService.GetByIdAsync(id); // përdor service-n
                if (patient == null)
                    return NotFound("Pacienti nuk u gjet");

                await _patientService.DeleteAsync(id); // soft delete
                return Ok("Pacienti u fshi me sukses");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Gabim i brendshëm: {ex.Message}");
            }
        }
    }
}

