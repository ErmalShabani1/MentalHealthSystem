using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IHealthReportRepository
    {
        Task AddAsync(HealthReports report);
        Task<IEnumerable<HealthReports>> GetAllAsync();
        Task<HealthReports?> GetByIdAsync(int id);
        Task<List<HealthReports>> GetByPatientIdAsync(int patientId);
        Task UpdateAsync(HealthReports report);
        Task DeleteAsync(int id);
        Task<int> CountAllAsync();
        Task<int> CountThisMonthAsync();
        Task<Dictionary<string, int>> CountByDiagnosisAsync();
        Task<Dictionary<string, int>> CountByPsikologAsync();
        Task SaveChangesAsync();
    }
}
