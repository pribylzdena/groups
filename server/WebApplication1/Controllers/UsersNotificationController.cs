using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersNotificationController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<UsersNotificationsResponseModel> models = new List<UsersNotificationsResponseModel>();

            foreach (var item in this.context.users_notifications)
            {
                models.Add(new UsersNotificationsResponseModel(item));
            }

            return Ok(models);
        }
    }
}
