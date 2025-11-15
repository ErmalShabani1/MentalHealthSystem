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
        public async Task DeleteAsync(int id)
        {
            var report = await _context.HealthReports.FindAsync(id);
            if(report != null)
            {
                _context.HealthReports.Remove(report);
                await _context.SaveChangesAsync();
            }
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
