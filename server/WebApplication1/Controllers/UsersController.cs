using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<UserResponseModel> models = new List<UserResponseModel>();

            foreach (var item in this.context.users)
            {
                models.Add(new UserResponseModel(item));
            }

            return Ok(models);
        }
    }
}
