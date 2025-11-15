using MentalHealthSystemManagement.Application.DTOs.Appointments;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Services
{
    public class AppointmentService
    {
        private readonly IAppointmentRepository _repository;
        
        public AppointmentService(IAppointmentRepository repository)
        {
            _repository = repository;
        }
        //per Adminin me mujt me i pa takimet
        public async Task<IEnumerable<Appointment>> GetAllApointmentsAsync()
        {
            return await _repository.GetAllAsync();
        }
        //me i pa takimet vetem te nje psikologi te caktuar
        public async Task<IEnumerable<AppointmentReadDto>> GetAppointmentsByPsikolog(int id)
        {
            return await _repository.GetByPsikologIdAsync(id);
        }
        public async Task<Appointment?> GetAppointmentsById(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task CreateAppointment(AppointmentDto dto)
        {
            if (dto.AppointmentDate < DateTime.Now)
                throw new Exception("Takimet nuk mund te jene ne te kaluaren");

            var appointment = new Appointment
            {
                PsikologId = dto.PsikologId,
                PatientId = dto.PatientId,
                PatientName = dto.PatientName ?? string.Empty,
                AppointmentDate = dto.AppointmentDate,
                Notes = dto.Notes ?? string.Empty,
                Status = "Scheduled"
            };

            await _repository.AddAsync(appointment);
        }
        public async Task UpdateAsync(Appointment appointment)
        {
            await _repository.UpdateAsync(appointment);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

    }
}