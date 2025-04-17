using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduledEventsController : ControllerBase
    {
        private MyContexct context = new MyContexct();
        [HttpGet]
        public IActionResult FindAll()
        {
            List<ScheduledEventResponseModel> models = new List<ScheduledEventResponseModel>();

            foreach (var item in this.context.scheduled_events)
            {
                models.Add(new ScheduledEventResponseModel(item));
            }

            return Ok(models);
        }
    }

}
