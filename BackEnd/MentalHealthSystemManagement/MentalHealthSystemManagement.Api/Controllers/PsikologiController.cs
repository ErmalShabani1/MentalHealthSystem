using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Application.DTOs.Psikologi;
using MentalHealthSystemManagement.Domain.Entities;
namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Psikolog")]
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
            try
            {
                var list = await _psikologiService.GetAllAsync();
                var result = list.Select(p => new PsikologiReadDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Name = p.Name ?? string.Empty,
                    Surname = p.Surname ?? string.Empty,
                    Specialization = p.Specialization ?? string.Empty,
                    ExperienceLevel = p.ExperienceLevel ?? string.Empty,
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
                return StatusCode(500, $"Gabim i brendshëm: {ex.Message}");
            }
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
            try
            {
                await _psikologiService.DeleteAsync(id);
                return Ok("Psikologi u fshi me sukses");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Gabim i brendshëm: {ex.Message}");
            }
        }
    }
}
