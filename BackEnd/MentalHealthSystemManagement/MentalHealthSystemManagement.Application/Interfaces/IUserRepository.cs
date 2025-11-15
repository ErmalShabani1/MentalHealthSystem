using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task<User?> GetByRefreshTokenAsync(string refreshToken);
        Task SaveChangesAsync();
    }
}