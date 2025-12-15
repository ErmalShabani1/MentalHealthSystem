using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class TreatmentPlanRepository : ITreatmentPlanRepository
    {
        private readonly ApplicationDbContext _context;

        public TreatmentPlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TreatmentPlan> CreateAsync(TreatmentPlan plan)
        {
            await _context.TreatmentPlans.AddAsync(plan);
            await _context.SaveChangesAsync();
            return plan;
        }
        public async Task<TreatmentPlan> GetByIdAsync(int id)
        {
            return await _context.TreatmentPlans
                .Include(x => x.Patient)
                .Include(x => x.Psikolog)
                .FirstOrDefaultAsync(x => x.TreatmentPlanId == id);
            
        }
        public async Task<IEnumerable<TreatmentPlan>> GetAllForPsikologAsync(int psikologId)
        {
            return await _context.TreatmentPlans
                .Where(x => x.PsikologId == psikologId)
                .ToListAsync();
        }
        public async Task<IEnumerable<TreatmentPlan>> GetAllForPatientAsync(int patientId)
        {
            return await _context.TreatmentPlans
                .Where(x => x.PatientId == patientId)
                .ToListAsync();
        }
        public async Task UpdateAsync(TreatmentPlan plan)
        {
            _context.TreatmentPlans.Update(plan);
            await _context.SaveChangesAsync();  
        }
        public async Task DeleteAsync(int id)
        {
            var plan = await _context.TreatmentPlans.FindAsync(id);
            if (plan != null)
            {
                _context.TreatmentPlans.Remove(plan);
                await _context.SaveChangesAsync();  
            }
        }
        public async Task DeleteByPatientIdAsync(int patientId)
        {
            var plan = _context.TreatmentPlans
                .Where(r => r.PatientId == patientId);

            _context.TreatmentPlans.RemoveRange(plan);
        }


    }
}
