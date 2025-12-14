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
        private int GetPsikologId()
        {
            var claim = User.FindFirst("PsikologId");
            if (claim == null)
                throw new Exception("PsikologId claim missing from token.");
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
        [Authorize(Roles = "Admin, Psikolog, Pacient")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }
        [HttpGet("my-news")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetMyNews()
        {
            var psikologId = GetPsikologId();

            var news = await _context.News
                .Where(n => n.PsikologId == psikologId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(news);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            var psikologId = GetPsikologId();

            var news = await _context.News
                .Where(n => n.Id == id && n.PsikologId == psikologId)
                .Select(n => new
                {
                    n.Id,
                    n.Description,
                    n.ImageUrl,
                    n.CreatedAt,
                    n.UpdatedAt,
                    PsikologName = n.Psikologu.Name + " " + n.Psikologu.Surname
                })
                .FirstOrDefaultAsync();

            if (news == null)
                return NotFound("News nuk u gjet ose nuk keni qasje.");

            return Ok(news);
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin, Psikolog")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateNewsDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok("News updated successfully");
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog")]

        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("News deleted successfully");
        }
    }
}
        
