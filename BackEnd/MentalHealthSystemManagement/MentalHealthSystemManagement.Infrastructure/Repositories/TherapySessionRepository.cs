using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class TherapySessionRepository : ITherapySessionRepository
    {
        private readonly ApplicationDbContext _context;

        public TherapySessionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TherapySession>> GetAllAsync()
        {
            return await _context.TherapySessions
                .Include(t => t.Psikologi)
                .Include(t => t.Patient)
                .OrderByDescending(t => t.SessionDate)
                .ToListAsync();
        }

        public async Task<TherapySession?> GetByIdAsync(int id)
        {
            return await _context.TherapySessions
                .Include(t => t.Psikologi)
                .Include(t => t.Patient)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<TherapySession>> GetByPatientIdAsync(int patientId)
        {
            return await _context.TherapySessions
                .Include(t => t.Psikologi)
                .Where(t => t.PatientId == patientId)
                .OrderByDescending(t => t.SessionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TherapySession>> GetByPsikologIdAsync(int psikologId)
        {
            return await _context.TherapySessions
                .Include(t => t.Patient)
                .Where(t => t.PsikologId == psikologId)
                .OrderByDescending(t => t.SessionDate)
                .ToListAsync();
        }

        public async Task<TherapySession> AddAsync(TherapySession therapySession)
        {
            await _context.TherapySessions.AddAsync(therapySession);
            await _context.SaveChangesAsync();
            return therapySession;
        }

        public async Task<TherapySession> UpdateAsync(TherapySession therapySession)
        {
            therapySession.UpdatedAt = DateTime.UtcNow;
            _context.TherapySessions.Update(therapySession);
            await _context.SaveChangesAsync();
            return therapySession;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var session = await _context.TherapySessions.FindAsync(id);
            if (session == null)
                return false;

            _context.TherapySessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
