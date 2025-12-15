using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface ITreatmentPlanRepository
    {
        Task<TreatmentPlan> CreateAsync(TreatmentPlan plan);
        Task<TreatmentPlan> GetByIdAsync(int id);
        Task<IEnumerable<TreatmentPlan>> GetAllForPsikologAsync(int psikologId);
        Task<IEnumerable<TreatmentPlan>> GetAllForPatientAsync(int patientId);
        Task UpdateAsync(TreatmentPlan plan);
        Task DeleteAsync(int id);
        Task DeleteByPatientIdAsync(int patientId);

    }
}
