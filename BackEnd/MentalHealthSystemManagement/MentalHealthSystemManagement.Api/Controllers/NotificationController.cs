using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MentalHealthSystemManagement.Application.DTOs.Notifications;
using MentalHealthSystemManagement.Application.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Text.Json;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _service;

        public NotificationController(NotificationService service)
        {
            _service = service;
        }

        // GET: api/Notification/all (Admin only)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllNotifications()
        {
            try
            {
                var notifications = await _service.GetAllNotificationsAsync();
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/Notification/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Psikolog,Pacient")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            try
            {
                var notification = await _service.GetNotificationByIdAsync(id);
                if (notification == null)
                    return NotFound("Notifikimi nuk u gjet");

                return Ok(notification);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/Notification/my-notifications (Patient only)
        [HttpGet("my-notifications")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetMyNotifications()
        {
            try
            {
                var patientIdClaim = User.FindFirst("PatientId")?.Value;
                if (string.IsNullOrEmpty(patientIdClaim) || !int.TryParse(patientIdClaim, out int patientId))
                    return Unauthorized("PatientId nuk u gjet në token");

                var notifications = await _service.GetNotificationsByPatientIdAsync(patientId);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/Notification/unread-count (Patient only)
        [HttpGet("unread-count")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var patientIdClaim = User.FindFirst("PatientId")?.Value;
                if (string.IsNullOrEmpty(patientIdClaim) || !int.TryParse(patientIdClaim, out int patientId))
                    return Unauthorized("PatientId nuk u gjet në token");

                var count = await _service.GetUnreadCountAsync(patientId);
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/Notification/by-psikolog (Psikolog only)
        [HttpGet("by-psikolog")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetNotificationsByPsikolog()
        {
            try
            {
                var psikologIdClaim = User.FindFirst("PsikologId")?.Value;
                if (string.IsNullOrEmpty(psikologIdClaim) || !int.TryParse(psikologIdClaim, out int psikologId))
                    return Unauthorized("PsikologId nuk u gjet në token");

                var notifications = await _service.GetNotificationsByPsikologIdAsync(psikologId);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // TEST: api/Notification/test (NO AUTH)
        [HttpPost("test")]
        public IActionResult Test(CreateNotificationDto dto)
        {
            return Ok(new { 
                message = "Received successfully", 
                patientId = dto.PatientId,
                title = dto.Title,
                messageText = dto.Message
            });
        }

        // POST: api/Notification/add (Psikolog only)
        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> CreateNotification([FromBody] JsonElement jsonData)
        {
            try
            {
                Console.WriteLine($"Received JSON: {jsonData}");
                
                if (!jsonData.TryGetProperty("PatientId", out var patientIdElement))
                    return BadRequest("PatientId mungon");
                if (!jsonData.TryGetProperty("Title", out var titleElement))
                    return BadRequest("Title mungon");
                if (!jsonData.TryGetProperty("Message", out var messageElement))
                    return BadRequest("Message mungon");
                
                var patientId = patientIdElement.GetInt32();
                var title = titleElement.GetString();
                var message = messageElement.GetString();
                
                if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(message))
                    return BadRequest("Title dhe Message nuk mund të jenë bosh");
                
                var dto = new CreateNotificationDto 
                { 
                    PatientId = patientId, 
                    Title = title, 
                    Message = message 
                };
                
                var psikologIdClaim = User.FindFirst("PsikologId")?.Value;
                if (string.IsNullOrEmpty(psikologIdClaim) || !int.TryParse(psikologIdClaim, out int psikologId))
                    return Unauthorized("PsikologId nuk u gjet në token");

                var notification = await _service.CreateNotificationAsync(psikologId, dto);
                return Ok(notification);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/Notification/{id} (Psikolog/Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> UpdateNotification(int id, [FromBody] UpdateNotificationDto dto)
        {
            try
            {
                if (id != dto.NotificationId)
                    return BadRequest("ID nuk përputhet");

                var notification = await _service.UpdateNotificationAsync(dto);
                return Ok(notification);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/Notification/mark-read/{id} (Patient only)
        [HttpPut("mark-read/{id}")]
        [Authorize(Roles = "Pacient")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var result = await _service.MarkAsReadAsync(id);
                if (!result)
                    return NotFound("Notifikimi nuk u gjet");

                return Ok(new { message = "Notifikimi u shënua si i lexuar" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Notification/{id} (Psikolog/Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            try
            {
                var result = await _service.DeleteNotificationAsync(id);
                if (!result)
                    return NotFound("Notifikimi nuk u gjet");

                return Ok("Notifikimi u fshi me sukses");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
