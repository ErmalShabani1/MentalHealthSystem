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
using MentalHealthSystemManagement.Application.DTOs.Appointments;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppointmentService _service;
        private readonly ApplicationDbContext _context;
        
        public AppointmentsController(AppointmentService service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }
        [HttpGet("psikolog/{id}")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> GetByPsikologi(int id)
        {
            var appointments = await _service.GetAppointmentsByPsikolog(id);
            return Ok(appointments);
        }
        [HttpPost("add")]
        [Authorize(Roles = "Psikolog")]
        public async Task<IActionResult> AddAppointments([FromBody] AppointmentDto dto)
        {
            try
            {
                // Merr emrin e pacientit nga databaza
                var patient = await _context.Patients.FindAsync(dto.PatientId);
                if (patient == null)
                    return BadRequest("Pacienti nuk u gjet");

                // Vendos emrin e pacientit në DTO
                dto.PatientName = $"{patient.Emri} {patient.Mbiemri}";

                await _service.CreateAppointment(dto);
                return Ok("Appointment added successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Gabim gjatë shtimit të takimit: " + ex.Message);
                if (ex.InnerException != null)
                    Console.WriteLine("InnerException: " + ex.InnerException.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
                return BadRequest("Id not the same");
            await _service.UpdateAsync(appointment);
            return Ok("Appointment Updated successfully");
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Psikolog,Admin")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Appointment deleted successfully");
        }
        //endpoints per Adminin
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _service.GetAllApointmentsAsync();
            return Ok(appointments);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var appointment = await _service.GetAppointmentsById(id);
            if (appointment == null) return BadRequest("Id not found");
            return Ok(appointment);
        }
    }
}