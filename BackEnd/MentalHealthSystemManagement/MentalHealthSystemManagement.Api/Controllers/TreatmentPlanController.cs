using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Application.DTOs;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Repositories;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.DTOs.TreatmentPlan;
using System.Security.Claims;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentPlanController : ControllerBase
    {
        private readonly TreatmentPlanService _service;

        public TreatmentPlanController(TreatmentPlanService service)
        {

            _service = service;
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

        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> Create(TreatmentPlanCreateDto dto)
        {
            var psikologId = GetPsikologId();
            return Ok(await _service.CreateAsync(psikologId, dto));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Psikolog,Patient")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = GetUserId();
            var role = GetRole();
            return Ok(await _service.GetByIdAsync(id, userId, role));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> Update(int id, TreatmentPlanUpdateDto dto)
        {
            await _service.UpdateAsync(id, GetUserId(), dto);
            return Ok("Updated");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, GetPsikologId());
            return Ok("Deleted");
        }

        [HttpGet("for-psikolog")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetForPsikolog()
        {
            return Ok(await _service.GetAllForPsikologAsync(GetPsikologId()));
        }

        [HttpGet("for-patient")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetForPatient()
        {
            return Ok(await _service.GetAllForPatientAsync(GetPsikologId()));
        }
    }
}

