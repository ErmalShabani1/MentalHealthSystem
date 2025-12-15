using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class HealthReportRepository : IHealthReportRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthReportRepository(ApplicationDbContext context)
    {
        _context = context;
    }
        public async Task AddAsync(HealthReports report)
        {
            _context.HealthReports.AddAsync(report);
            await _context.SaveChangesAsync();

        }
        public async Task<IEnumerable<HealthReports>> GetAllAsync()
        {
            return await _context.HealthReports
                .Include(r => r.Psikologi)
                .Include(r => r.Patient)
                .ToListAsync();
        }
        public async Task<HealthReports?> GetByIdAsync(int id)
        {
            return await _context.HealthReports
                .Include(r => r.Psikologi)
                .Include(r => r.Patient)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task UpdateAsync(HealthReports report)
        {
            _context.HealthReports.Update(report);
            await _context.SaveChangesAsync();
        }
        public async Task<List<HealthReports>> GetByPatientIdAsync(int patientId)
        {
            return await _context.HealthReports
                .Include(hr => hr.Psikologi)
                .Where(hr => hr.PatientId == patientId)
                .OrderByDescending(hr => hr.CreatedAt)
                .ToListAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var report = await _context.HealthReports.FindAsync(id);
            if(report != null)
            {
                _context.HealthReports.Remove(report);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteByPatientIdAsync(int patientId)
        {
            var reports = _context.HealthReports
                .Where(r => r.PatientId == patientId);

            _context.HealthReports.RemoveRange(reports);
        }
        public async Task<int> CountAllAsync()
        {
            return await _context.HealthReports.CountAsync();
        }

        public async Task<int> CountThisMonthAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.HealthReports
                .CountAsync(r => r.CreatedAt.Month == now.Month && r.CreatedAt.Year == now.Year);
        }

        public async Task<Dictionary<string, int>> CountByDiagnosisAsync()
        {
            return await _context.HealthReports
                .GroupBy(r => r.Diagnoza)
                .Select(g => new { Diagnoza = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Diagnoza, x => x.Count);
        }

        public async Task<Dictionary<string, int>> CountByPsikologAsync()
        {
            return await _context.HealthReports
                .Include(r => r.Psikologi)
                .GroupBy(r => r.Psikologi.Name + " " + r.Psikologi.Surname)
                .Select(g => new { Name = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Name, x => x.Count);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
