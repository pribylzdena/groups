using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("users")]
        public IActionResult FindAll()
        {
            List<UserResponseModel> response = new List<UserResponseModel>();

            foreach (var item in this.context.users)
            {
                response.Add(new UserResponseModel(item));
            }

            return Ok(response);
        }

        [HttpGet("users/current")]
        public IActionResult GetCurrentUser()
        {
            int id = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);
            User? currentUser = this.context.users.FirstOrDefault(u => u.id == id);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var response = new UserResponseModel(currentUser);

            return Ok(response);
        }
         

        [HttpPut("users/{userId}")]
        public IActionResult Edit(int userId, [FromBody]UserRequestModel request)
        {
            int id = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);
            User? currentUser = this.context.users.FirstOrDefault(u => u.id == id);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            Models.User? user = this.context.users.FirstOrDefault(x => x.id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.email = request.email;
            user.password = request.password ?? user.password;
            user.logo = request.logoUrl;
            user.name = request.name;
            this.context.SaveChanges();

            var response = new UserResponseModel(user);
            return Ok(response);
        }


    }
}
