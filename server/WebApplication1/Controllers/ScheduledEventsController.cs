using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class ScheduledEventsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("groups/{groupId}/events")]
        public IActionResult FindAll(int groupId)
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
