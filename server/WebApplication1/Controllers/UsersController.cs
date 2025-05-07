using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("user/{id}")]
        public IActionResult FindById(int id)
        {
            Models.User? user = this.context.users.FirstOrDefault(x => x.id == id);

            if (user == null)
            {
                return NotFound(new {message = "User not found"});
            }

            var response = new UserResponseModel(user);
            return Ok(response);
        }


        [HttpPut("user/{id}/edit")]
        public IActionResult Edit(int id, [FromBody]UserRequestModel request)
        {
            Models.User? user = this.context.users.FirstOrDefault(x => x.id == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request" });
            }

            user.email = request.email;
            user.password = request.password;
            user.logo = request.logo;
            user.name = request.name;
            this.context.SaveChanges();

            var response = new UserResponseModel(user);
            return Ok(response);
        }


    }
}
