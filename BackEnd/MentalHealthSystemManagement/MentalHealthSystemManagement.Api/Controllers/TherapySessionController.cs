using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Application.DTOs.TherapySessions;
using System.Security.Claims;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapySessionController : ControllerBase
    {
        private readonly TherapySessionService _service;

        public TherapySessionController(TherapySessionService service)
        {
            _service = service;
        }

        // GET: api/TherapySession/all (Psikolog only)
        [HttpGet("all")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> GetAllSessions()
        {
            try
            {
                var sessions = await _service.GetAllSessionsAsync();
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/TherapySession/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Psikolog,Admin,Pacient")]
        public async Task<IActionResult> GetSessionById(int id)
        {
            try
            {
                var session = await _service.GetSessionByIdAsync(id);
                if (session == null)
                    return NotFound("Seanca nuk u gjet");

                return Ok(session);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/TherapySession/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Psikolog,Admin,Pacient")]
        public async Task<IActionResult> GetSessionsByPatient(int patientId)
        {
            try
            {
                var sessions = await _service.GetSessionsByPatientIdAsync(patientId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/TherapySession/my-sessions (Patient reads own sessions)
        [HttpGet("my-sessions")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetMySessions()
        {
            try
            {
                var patientIdClaim = User.FindFirst("PatientId")?.Value;
                if (string.IsNullOrEmpty(patientIdClaim) || !int.TryParse(patientIdClaim, out int patientId))
                    return Unauthorized("PatientId nuk u gjet në token");

                var sessions = await _service.GetSessionsByPatientIdAsync(patientId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/TherapySession/psikolog/{psikologId}
        [HttpGet("psikolog/{psikologId}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> GetSessionsByPsikolog(int psikologId)
        {
            try
            {
                var sessions = await _service.GetSessionsByPsikologIdAsync(psikologId);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/TherapySession/add (Psikolog only)
        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> CreateSession([FromBody] CreateTherapySessionDto dto)
        {
            try
            {
                var psikologIdClaim = User.FindFirst("PsikologId")?.Value;
                if (string.IsNullOrEmpty(psikologIdClaim) || !int.TryParse(psikologIdClaim, out int psikologId))
                    return Unauthorized("PsikologId nuk u gjet në token");

                var session = await _service.CreateSessionAsync(psikologId, dto);
                return Ok(session);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Gabim gjatë shtimit të seancës: " + ex.Message);
                if (ex.InnerException != null)
                    Console.WriteLine("InnerException: " + ex.InnerException.Message);
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/TherapySession/{id} (Psikolog only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] UpdateTherapySessionDto dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest("ID nuk përputhet");

                var session = await _service.UpdateSessionAsync(dto);
                return Ok(session);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/TherapySession/{id} (Psikolog only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            try
            {
                var result = await _service.DeleteSessionAsync(id);
                if (!result)
                    return NotFound("Seanca nuk u gjet");

                return Ok("Seanca u fshi me sukses");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
