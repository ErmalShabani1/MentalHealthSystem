using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthSystemManagement.Infrastructure.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly ApplicationDbContext _context;

        public NewsRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(News news)
        {
            await _context.News.AddAsync(news);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<News>> GetAllAsync()
        {
            return await _context.News
                .Include(n => n.Psikologu)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }
        public async Task<News?> GetByIdAsync(int id)
        {
            return await _context.News
                .Include (n => n.Psikologu)
                .FirstOrDefaultAsync(n => n.Id == id);
        }
        public async Task UpdateAsync(News news)
        {
            _context.News.Update(news);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if(news != null)
            {
                _context.News.Remove(news);
                await _context.SaveChangesAsync();
            }
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
