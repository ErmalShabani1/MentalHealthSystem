using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MentalHealthSystemManagement.Application.DTOs.User;
using MentalHealthSystemManagement.Application.Services;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authservice;
        private readonly JwtService _jwtservice;

        public AuthController(AuthService authservice, JwtService jwtservice)
        {
            _authservice = authservice;
            _jwtservice = jwtservice;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            var result = await _authservice.RegisterAsync(dto);
            if (result == "User already exists") 
            return BadRequest(result);

            return Ok(result);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            var user = await _authservice.LoginAsync(dto);
            if (user == null) return Unauthorized("Emri ose passwordi jane dhene gabim");

            var jwtservice = new JwtService(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            var token = jwtservice.GenerateToken(user.Id.ToString(), user.Username, user.Role);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });


            return Ok(new { message = "Login successful", user = new { user.Username, user.Email, user.Role } });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfullt" });
        }
    }
}
