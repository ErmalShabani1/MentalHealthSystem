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
        private int GetPatientId()
        {
            var claim = User.FindFirst("PatientId");
            if (claim == null)
                throw new Exception("PatientId claim missing from token.");
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
        [Authorize(Roles = "Psikolog,Pacient")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var userId = GetUserId();
                var role = GetRole();

                if (role == "Psikolog")
                {
                    var psikologId = GetPsikologId();
                    return Ok(await _service.GetByIdAsync(id));
                }
                else if (role == "Pacient")
                {
                    // patient nuk ka psikologId claim
                    return Ok(await _service.GetByIdAsync(id));
                }
                else
                {
                    return Forbid();
                }
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Gabim në GetTreatmentPlan: {ex}");
                return StatusCode(500, new { message = "Gabim gjatë marrjes së planit", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> Update(int id, TreatmentPlanUpdateDto dto)
        {
            try
            {
                await _service.UpdateAsync(id, GetPsikologId(), dto);
                return Ok(new { message = "Updated successfully" });
            }
            catch (KeyNotFoundException ex) // për ID që nuk ekziston
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex) // nëse user nuk ka akses
            {
                return Forbid();
            }
            catch (Exception ex) // çdo gabim tjetër
            {
                // e printon gabimin në log (opsionale)
                Console.Error.WriteLine($"Gabim në UpdateTreatmentPlan: {ex}");

                // kthen gabim të detajuar në JSON
                return StatusCode(500, new { message = "Gabim gjatë përditësimit të planit", details = ex.Message });
            }
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
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetForPatient()
        {
            return Ok(await _service.GetAllForPatientAsync(GetPatientId()));
        }
    }
}

