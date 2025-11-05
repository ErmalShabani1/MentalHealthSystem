using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Application.DTOs.Psikologi;
namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class PsikologiController : ControllerBase
    {
        private readonly PsikologService _psikologiService;
        public PsikologiController(PsikologService psikologiService)
        {
            _psikologiService = psikologiService;
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddPsikologin([FromBody] PsikologiDto dto)
        {
            try
            {
                await _psikologiService.AddPsikologAsync(
                    dto.Username, dto.Email, dto.Password,
                    dto.Name, dto.Surname, dto.Specialization, dto.ExperienceLevel
                );

                return Ok("Psikologu u shtua me sukses!");
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
            var list = await _psikologiService.GetAllAsync();
            return Ok(list);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePsikologiDto dto)
        {
            await _psikologiService.UpdateAsync(id, dto.Name, dto.Surname, dto.Specialization, dto.ExperienceLevel);
            return Ok("Psikologi updated me sukses");
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _psikologiService.DeleteAsync(id);
            return Ok("Psikologi u fshi me sukses");
        }
    }
}
