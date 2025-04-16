using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<NotificationsResponseModel> models = new List<NotificationsResponseModel>();

            foreach (var item in this.context.notifications)
            {
                models.Add(new NotificationsResponseModel(item));
            }

            return Ok(models);
        }
    }
}
