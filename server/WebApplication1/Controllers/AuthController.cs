using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private DB _db = new();
        private TokenService _tokenService = new TokenService();

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = _db.users.FirstOrDefault(u => u.email == req.Email) != null;
            if (exists)
                return Conflict(new { message = "Email už je registrován." });

            var user = new User
            {
                email = req.Email,
                name = req.Name,
                password = req.Password
            };

            _db.users.Add(user);
            _db.SaveChanges();

            return CreatedAtAction(null, new { user.id });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _db.users
                .FirstOrDefault(u => u.email == req.Email && u.password == req.Password);
            if (user == null)
                return Unauthorized(new { message = "Neplatné přihlašovací údaje." });

            string jwt = _tokenService.Create(user);

            return Ok(new { token = jwt });
        }
    }
}
