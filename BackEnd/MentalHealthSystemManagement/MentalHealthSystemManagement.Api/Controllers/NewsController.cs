using MentalHealthSystemManagement.Application.DTOs.News;
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
    public class NewsController : ControllerBase
    {
        private readonly NewsService _service;
        private readonly ApplicationDbContext _context;

        public NewsController(NewsService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context; 
        }
        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        private string GetRole() =>
            User.FindFirst(ClaimTypes.Role).Value;
        private int GetPsikologId()
        {
            var claim = User.FindFirst("PsikologId");
            if (claim == null)
                throw new Exception("PsikologId claim missing from token.");
            return int.Parse(claim.Value);

        }
        private int GetPatientId()
        {
            var claim = User.FindFirst("PatientId");
            if (claim == null)
                throw new Exception("PatientId claim missing from token.");
            return int.Parse(claim.Value);
        }
        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> AddNews([FromForm] CreateNewsDto dto)
        {
            var psikologId = GetPsikologId();
            await _service.AddNewsAsync(psikologId, dto);
            return Ok("News added successfully");
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Psikolog")]

        public async Task<IActionResult> Update(int id, [FromBody] UpdateNewsDto dto)
        {

            await _service.UpdateAsync(id, dto);
            return Ok("News updated sucessfully");
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog")]

        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("News deleted successfully");
        }
        [HttpGet("me")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetCurrentPsikolog()
        {
            var psikologId = GetPsikologId();
            var psikolog = await _context.Psikologet
                .Where(p => p.Id == psikologId)
                .Select(p => new { p.Id, p.Name, p.Surname })
                .FirstOrDefaultAsync();

            if (psikolog == null)
                return NotFound("Psikologu nuk u gjet");

            return Ok(psikolog);
        }
    }
}
