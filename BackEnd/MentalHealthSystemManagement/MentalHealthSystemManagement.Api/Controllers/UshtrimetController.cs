using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;
using MentalHealthSystemManagement.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UshtrimetController : ControllerBase
    {
        private readonly UshtrimiService _service;

        public UshtrimetController(UshtrimiService service)
        {
            _service = service;
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
    }
}
