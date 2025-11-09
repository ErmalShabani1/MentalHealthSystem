using MentalHealthSystemManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IPatientRepository
    {
        Task AddAsync(Patient patient);
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient?> GetByIdAsync(int id);
        Task UpdateAsync(Patient patient);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}
