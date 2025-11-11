using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MentalHealthSystemManagement.Domain.Entities;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface IPsikologRepository
    {
        Task AddAsync(Psikologi psikolog);
        Task<IEnumerable<Psikologi>> GetAllAsync();
        Task<Psikologi?> GetByIdAsync(int id);
        Task UpdateAsync(Psikologi psikolog);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}