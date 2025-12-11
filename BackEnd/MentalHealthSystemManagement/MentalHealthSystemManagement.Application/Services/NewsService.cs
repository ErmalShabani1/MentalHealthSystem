using MentalHealthSystemManagement.Application.DTOs.News;
using MentalHealthSystemManagement.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Application.DTOs.News;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using Microsoft.AspNetCore.Http;


namespace MentalHealthSystemManagement.Application.Services
{
    public class NewsService
    {
        private readonly INewsRepository _repository;

        public NewsService(INewsRepository repository)
        {
            _repository = repository;
        }
        public async Task AddNewsAsync(int psikologId, CreateNewsDto dto)
        {
            var imagePath = await SaveNewsImage(dto.Image);

            var news = new News
            {
                Description = dto.Description,
                ImageUrl = imagePath,
                PsikologId = psikologId,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(news);
            await _repository.SaveChangesAsync();
        }
        public async Task<IEnumerable<NewsDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(n => new NewsDto
            {
                Id = n.Id,
                PsikologName = $"{n.Psikologu.Name} {n.Psikologu.Surname}",
                Description = n.Description,
                ImageUrl = n.ImageUrl,
                CreatedAt = n.CreatedAt
            });
        }
        public async Task UpdateAsync(int id, UpdateNewsDto dto)
        {
            var news = await _repository.GetByIdAsync(id);
            if (news == null) throw new Exception("News not found!");

            news.Description = dto.Description;
            news.ImageUrl = dto.ImageUrl;
            news.UpdatedAt = DateTime.UtcNow;

            await _repository.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
        public async Task<string> SaveNewsImage(IFormFile imageFile)
        {
            // Krijo folderin nëse nuk ekziston
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "newsImages");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Krijo emrin e file
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Ruaj file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // Kthe URL relative (JO absolute path)
            return $"/newsImages/{uniqueFileName}"; // Kjo është e rëndësishme
        }
    }
}
