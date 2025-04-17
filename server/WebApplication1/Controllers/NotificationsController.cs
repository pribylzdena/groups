using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<NotificationResponseModel> models = new List<NotificationResponseModel>();

            foreach (var item in this.context.notifications)
            {
                models.Add(new NotificationResponseModel(item));
            }

            return Ok(models);
        }
    }
}
