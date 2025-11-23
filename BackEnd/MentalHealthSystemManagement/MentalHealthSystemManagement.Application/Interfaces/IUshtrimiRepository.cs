using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IUshtrimiRepository
    {
        Task<IEnumerable<Ushtrimi>> GetAllAsync();
        Task<Ushtrimi?> GetByIdAsync(int id);
        Task<IEnumerable<UshtrimiReadDto>> GetByPsikologIdAsync(int psikologId);

        Task AddAsync(Ushtrimi ushtrimi);
        Task UpdateAsync(Ushtrimi ushtrimi);
        Task DeleteAsync(int id);
    }
}
