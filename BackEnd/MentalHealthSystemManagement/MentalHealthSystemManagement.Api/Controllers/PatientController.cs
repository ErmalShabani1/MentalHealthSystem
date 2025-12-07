using MentalHealthSystemManagement.Application.DTOs.Pacienti;
using MentalHealthSystemManagement.Application.DTOs.Psikologi;
using MentalHealthSystemManagement.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [Authorize(Roles ="Admin, Psikolog")]
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
            var list = await _patientService.GetAllAsync();
            return Ok(list);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
        {
            await _patientService.UpdateAsync(id, dto.Emri, dto.Mbiemri, dto.Mosha, dto.Gjinia, dto.Diagnoza);
            return Ok("Pacienti updated me sukses");
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
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