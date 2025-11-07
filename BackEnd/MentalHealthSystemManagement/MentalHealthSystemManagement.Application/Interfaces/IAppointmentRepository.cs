using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Application.DTOs.Appointments;


namespace MentalHealthSystemManagement.Application.Interfaces
{ 
    public interface IAppointmentRepository
    {
    Task<IEnumerable<Appointment>> GetAllAsync();
    Task<IEnumerable<Appointment>> GetByPsikologIdAsync(int id);
    Task<Appointment> GetByIdAsync(int id);
    Task AddAsync(Appointment dto);
    Task UpdateAsync(Appointment appointment);
    Task DeleteAsync(int id);

    }
}
