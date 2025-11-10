using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MentalHealthSystemManagement.Application.DTOs.Appointments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments.ToListAsync();
        }
        public async Task<IEnumerable<AppointmentReadDto>> GetByPsikologIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.PsikologId == id)
                .Select(a => new AppointmentReadDto
                {
                    Id = a.Id,
                    PatientName = a.Patient != null ? a.Patient.Emri + " " + a.Patient.Mbiemri : "Nuk u gjet",
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Notes = a.Notes
                })
                .ToListAsync();
        }
        public async Task<Appointment?> GetByIdAsync(int id)
        {
            return await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id);
        }
        public async Task AddAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Appointment appointment)
        {
            var existingAppointment = await _context.Appointments.FindAsync(appointment.Id);
            if (existingAppointment == null)
                throw new Exception("Appointment not found");

            // Përditëso vetëm fushat që lejon frontend-i të ndryshohen
            existingAppointment.PatientId = appointment.PatientId;
            existingAppointment.AppointmentDate = appointment.AppointmentDate;
            existingAppointment.Notes = appointment.Notes;
            existingAppointment.Status = appointment.Status;

            // Mos prek PsikologId, PatientName etj.
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
                if(appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<PatientReportDto>> GetPatientReportsByPsikologIdAsync(int psikologId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.PsikologId == psikologId)
                .OrderBy(a => a.PatientId)
                .ThenByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var reports = appointments
                .GroupBy(a => a.PatientId)
                .Select(g => 
                {
                    var firstAppointment = g.First();
                    var patient = firstAppointment.Patient;
                    return new PatientReportDto
                    {
                        PatientId = g.Key,
                        PatientName = patient != null 
                            ? $"{patient.Emri} {patient.Mbiemri}" 
                            : "Nuk u gjet",
                        Email = patient?.User?.Email ?? "N/A",
                        Mosha = patient?.Mosha ?? 0,
                        Gjinia = patient?.Gjinia ?? "N/A",
                        Diagnoza = patient?.Diagnoza ?? "N/A",
                        Appointments = g.Select(a => new AppointmentNoteDto
                        {
                            AppointmentId = a.Id,
                            AppointmentDate = a.AppointmentDate,
                            Status = a.Status,
                            Notes = a.Notes
                        }).ToList()
                    };
                })
                .ToList();

            return reports;
        }

    }
}

