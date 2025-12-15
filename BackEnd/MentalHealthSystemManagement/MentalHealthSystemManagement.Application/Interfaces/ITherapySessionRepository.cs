using MentalHealthSystemManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface ITherapySessionRepository
    {
        Task<IEnumerable<TherapySession>> GetAllAsync();
        Task<TherapySession?> GetByIdAsync(int id);
        Task<IEnumerable<TherapySession>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<TherapySession>> GetByPsikologIdAsync(int psikologId);
        Task<TherapySession> AddAsync(TherapySession therapySession);
        Task<TherapySession> UpdateAsync(TherapySession therapySession);
        Task<bool> DeleteAsync(int id);
        Task DeleteByPatientIdAsync(int patientId);
    }
}
