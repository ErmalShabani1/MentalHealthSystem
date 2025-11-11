using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class PsikologRepository : IPsikologRepository
    {
        private readonly ApplicationDbContext _context;

        public PsikologRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Psikologi psikolog)
        {
            _context.Psikologet.Add(psikolog);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Psikologi>> GetAllAsync()
        {
            return await _context.Psikologet.Include(p => p.User).ToListAsync();
        }
        public async Task<Psikologi?> GetByIdAsync(int id)
        {
            return await _context.Psikologet.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task UpdateAsync(Psikologi psikolog)
        {
            _context.Psikologet.Update(psikolog);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var psikologi = await _context.Psikologet.FindAsync(id);
            if (psikologi != null)
            {
                _context.Psikologet.Remove(psikologi);
                await _context.SaveChangesAsync();
            }
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}