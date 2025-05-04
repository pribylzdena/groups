using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using System.Xml.Linq;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    //[Secured]
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

        [HttpPost("groups/{groupId}/schedule")]
        public IActionResult Create(int groupId, [FromBody] ScheduledEventRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var newNote = new Models.ScheduledEvent
            {
                name = request.name,
                color = request.color,
                starts_at = request.starts_at,
                status = request.status,
                ends_at = request.ends_at,
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };

            this.context.scheduled_events.Add(newNote);
            this.context.SaveChanges();

            var response = new ScheduledEventResponseModel(newNote);
            return CreatedAtAction(nameof(Create), response);
        }

        [HttpPut("groups/{groupId}/schedule/{id}")]
        public IActionResult Edit(int groupId, int id, [FromBody] ScheduledEventRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var scheduled_event = this.context.scheduled_events.FirstOrDefault(n => n.id == id);
            if (scheduled_event == null)
            {
                return NotFound(new { message = "Scheduled event not found" });
            }

            Console.WriteLine("Edit action called with data: group_id = " + groupId + " id = " + id + " userId = " + userId);

            scheduled_event.name = request.name;
            scheduled_event.color = request.color;
            scheduled_event.starts_at = request.starts_at;
            scheduled_event.status = request.status;
            scheduled_event.ends_at = request.ends_at;
            scheduled_event.group_id = groupId;
            scheduled_event.created_by = currentUser.id;
            scheduled_event.updated_by = currentUser.id;
            scheduled_event.created_at = DateTime.UtcNow;
            scheduled_event.updated_at = DateTime.UtcNow;
            scheduled_event.deleted_at = null;
            this.context.SaveChanges();

            var response = new ScheduledEventResponseModel(scheduled_event);
            return Ok(response);
        }

    }

}
