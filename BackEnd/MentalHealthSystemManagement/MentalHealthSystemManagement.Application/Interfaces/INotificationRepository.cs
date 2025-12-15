using MentalHealthSystemManagement.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetAllAsync();
        Task<Notification?> GetByIdAsync(int id);
        Task<IEnumerable<Notification>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<Notification>> GetByPsikologIdAsync(int psikologId);
        Task<int> GetUnreadCountByPatientIdAsync(int patientId);
        Task<Notification> AddAsync(Notification notification);
        Task<Notification> UpdateAsync(Notification notification);
        Task<bool> DeleteAsync(int id);
        Task DeleteByPatientIdAsync(int patientId);
        Task<bool> MarkAsReadAsync(int id);
    }
}
