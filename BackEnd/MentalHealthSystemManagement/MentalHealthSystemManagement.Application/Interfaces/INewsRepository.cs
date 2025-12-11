using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Domain.Entities
;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface INewsRepository
    {
        Task AddAsync(News news);
        Task<IEnumerable<News>> GetAllAsync();
        Task<News?>GetByIdAsync(int id);
        Task UpdateAsync(News news);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();

    }
}
