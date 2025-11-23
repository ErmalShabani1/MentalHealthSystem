using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class UshtrimiRepository : IUshtrimiRepository
    {
        private readonly ApplicationDbContext _context;

        public UshtrimiRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Ushtrimi>> GetAllAsync()
        {
            return await _context.Ushtrimet
                .Include(u => u.Psikolog)
                .Include(u => u.Patient)
                .ToListAsync();
        }

        public async Task<Ushtrimi?> GetByIdAsync(int id)
        {
            return await _context.Ushtrimet.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<UshtrimiReadDto>> GetByPsikologIdAsync(int psikologId)
        {
            return await _context.Ushtrimet
                .Where(u => u.PsikologId == psikologId)
                .Select(u => new UshtrimiReadDto
                {
                    Id = u.Id,
                    Titulli = u.Titulli,
                    Pershkrimi = u.Pershkrimi,
                    DataKrijimit = u.DataKrijimit,
                    PsikologId = u.PsikologId,
                    PatientId = u.PatientId
                })
                .ToListAsync();
        }

        public async Task AddAsync(Ushtrimi ushtrimi)
        {
            await _context.Ushtrimet.AddAsync(ushtrimi);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Ushtrimi ushtrimi)
        {
            var existing = await _context.Ushtrimet.FindAsync(ushtrimi.Id);
            if (existing == null) throw new Exception("Ushtrimi nuk u gjet");

            existing.Titulli = ushtrimi.Titulli;
            existing.Pershkrimi = ushtrimi.Pershkrimi;
            existing.PatientId = ushtrimi.PatientId;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var ushtrimi = await _context.Ushtrimet.FindAsync(id);
            if (ushtrimi != null)
            {
                _context.Ushtrimet.Remove(ushtrimi);
                await _context.SaveChangesAsync();
            }
        }
    }
}
