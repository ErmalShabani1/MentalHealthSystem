using MentalHealthSystemManagement.Application.DTOs.Notifications;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Services
{
    public class NotificationService
    {
        private readonly INotificationRepository _repository;

        public NotificationService(INotificationRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync()
        {
            var notifications = await _repository.GetAllAsync();
            return notifications.Select(MapToDto);
        }

        public async Task<NotificationDto?> GetNotificationByIdAsync(int id)
        {
            var notification = await _repository.GetByIdAsync(id);
            return notification != null ? MapToDto(notification) : null;
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsByPatientIdAsync(int patientId)
        {
            var notifications = await _repository.GetByPatientIdAsync(patientId);
            return notifications.Select(MapToDto);
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsByPsikologIdAsync(int psikologId)
        {
            var notifications = await _repository.GetByPsikologIdAsync(psikologId);
            return notifications.Select(MapToDto);
        }

        public async Task<int> GetUnreadCountAsync(int patientId)
        {
            return await _repository.GetUnreadCountByPatientIdAsync(patientId);
        }

        public async Task<NotificationDto> CreateNotificationAsync(int psikologId, CreateNotificationDto dto)
        {
            var notification = new Notification
            {
                PsikologId = psikologId,
                PatientId = dto.PatientId,
                Title = dto.Title,
                Message = dto.Message,
                IsRead = false,
                SentAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.AddAsync(notification);
            
            // Reload to get navigation properties
            var reloaded = await _repository.GetByIdAsync(created.NotificationId);
            return MapToDto(reloaded!);
        }

        public async Task<NotificationDto> UpdateNotificationAsync(UpdateNotificationDto dto)
        {
            var existing = await _repository.GetByIdAsync(dto.NotificationId);
            if (existing == null)
                throw new Exception("Notifikimi nuk u gjet");

            existing.Title = dto.Title;
            existing.Message = dto.Message;
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _repository.UpdateAsync(existing);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteNotificationAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            return await _repository.MarkAsReadAsync(id);
        }

        private NotificationDto MapToDto(Notification notification)
        {
            return new NotificationDto
            {
                NotificationId = notification.NotificationId,
                PsikologId = notification.PsikologId,
                PsikologName = notification.Psikologi != null 
                    ? $"{notification.Psikologi.Name} {notification.Psikologi.Surname}" 
                    : "N/A",
                PatientId = notification.PatientId,
                PatientName = notification.Patient != null 
                    ? $"{notification.Patient.Emri} {notification.Patient.Mbiemri}" 
                    : "N/A",
                Title = notification.Title,
                Message = notification.Message,
                IsRead = notification.IsRead,
                SentAt = notification.SentAt,
                ReadAt = notification.ReadAt,
                CreatedAt = notification.CreatedAt
            };
        }
    }
}
