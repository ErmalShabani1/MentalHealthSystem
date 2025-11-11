using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task<User?> GetByRefreshTokenAsync(string refreshToken);
        Task SaveChangesAsync();
    }
}