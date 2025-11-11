using MentalHealthSystemManagement.Application.DTOs.User;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using System.Security.Cryptography;

namespace MentalHealthSystemManagement.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Regjistrimi i përdoruesit
        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return "User already exists";

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), // Hash me BCrypt
                Role = dto.Role,
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return "User registered successfully";
        }

        // Login-i i përdoruesit
        public async Task<User?> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return null;

            // Krahaso password-in me hash-in e ruajtur
            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isValid)
                return null;

            // Gjenero refresh token
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();

            return user;
        }

        // Merr përdoruesin nga refresh token
        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _userRepository.GetByRefreshTokenAsync(refreshToken);
        }

        // Përditësim përdoruesi
        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}