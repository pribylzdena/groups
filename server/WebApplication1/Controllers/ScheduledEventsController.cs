using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduledEventsController : ControllerBase
    {
        private DB context = new DB();
        [HttpGet]
        public IActionResult FindAll()
        {
            List<ScheduledEventResponseModel> models = new List<ScheduledEventResponseModel>();

            foreach (var item in this.context.scheduled_event)
            {
                models.Add(new ScheduledEventResponseModel(item));
            }

            return Ok(models);
        }
    }

}
