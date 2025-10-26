using MentalHealthSystemManagement.Application.DTOs.User;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthSystemManagement.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return "User already exists";

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = dto.Role,
            };

            await _userRepository.AddAsync(user);
            return "User registered successfully";
        }

        public async Task<User?> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return null;

            if (user.PasswordHash != HashPassword(dto.Password))
                return null;

            return user;
        }
     

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
