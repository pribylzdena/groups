using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Drawing;
using System.Threading.Tasks;
using System.Xml.Linq;
using WebApplication1.Models;
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
            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

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


            var allEvents = this.context.scheduled_events;
            var allParticipants = this.context.event_participants.ToList();
            var currUserParticipants = this.context.event_participants.Where(x => x.user_id == userId).ToList();
            var currUserEvents = new List<ScheduledEvent>();

            foreach (var item in currUserParticipants)
            {
                ScheduledEvent? events = new ScheduledEvent();

                events = allEvents.Find(item.event_id);
                if (events != null) currUserEvents.Add(events);
            }
            var response = new List<ScheduledEventResponseModel>();

            foreach (var item in currUserEvents)
            {
                response.Add(new ScheduledEventResponseModel(item));
            }

            foreach (var _event in response)
            {
                foreach (var recip in allParticipants)
                {
                    if (recip.event_id == _event.id)
                    {
                        var user = this.context.users.Find(recip.user_id);

                        _event.participants.Add(new EventParticipantResponseModel(recip, user));
                    }
                }
            }



            return Ok(response);
        }

        [HttpPost("groups/{groupId}/events")]
        public IActionResult Create(int groupId, [FromBody] ScheduledEventRequest request)
        {
            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

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

            Console.WriteLine(request.startsAt);
            Console.WriteLine(request.endsAt);

            var newEvent = new Models.ScheduledEvent
            {
                name = request.name,
                color = request.color,
                starts_at = DateTime.Parse(request.startsAt),
                status = request.status,
                ends_at = DateTime.Parse(request.endsAt),
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };

            this.context.scheduled_events.Add(newEvent);
            this.context.SaveChanges();

            var participant = new EventParticipant();
            participant.event_id = newEvent.id;
            participant.user_id = userId;

            var response = new ScheduledEventResponseModel(newEvent);

            if (request.participants == null || request.participants.Count == 0)
            {
                response.participants.Add(new EventParticipantResponseModel(participant, this.context.users.Find(participant.user_id)));
                this.context.event_participants.Add(participant);
                this.context.SaveChanges();
                return Ok(response);
            }

            foreach (var item in request.participants!)
            {
                var newParticipant = new EventParticipant();
                newParticipant.user_id = item.user.id;
                newParticipant.event_id = newEvent.id;

                var newUser = new User();
                newUser = this.context.users.Find(item.user.id);
                if (newUser == null) continue;

                response.participants.Add(new EventParticipantResponseModel(newParticipant, newUser));
                this.context.event_participants.Add(newParticipant);
                this.context.SaveChanges();
            }

            return CreatedAtAction(nameof(Create), response);
        }

        [HttpPut("groups/{groupId}/events/{id}")]
        public IActionResult Edit(int groupId, int id, [FromBody] ScheduledEventRequest request)
        {
            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

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
            scheduled_event.starts_at = DateTime.Parse(request.startsAt);
            scheduled_event.status = request.status;
            scheduled_event.ends_at = DateTime.Parse(request.endsAt);
            scheduled_event.group_id = groupId;
            scheduled_event.created_by = currentUser.id;
            scheduled_event.updated_by = currentUser.id;
            scheduled_event.created_at = DateTime.UtcNow;
            scheduled_event.updated_at = DateTime.UtcNow;
            scheduled_event.deleted_at = null;
            this.context.SaveChanges();

            var response = new ScheduledEventResponseModel(scheduled_event);

            var particpants = new List<EventParticipantResponseModel>();
            //var eventParticipants = this.context.event_participants.Where(e => e.event_id == scheduled_event.id).ToList();

            foreach (var item in request.participants)
            {
                
                var participant = new EventParticipant();
                participant.event_id = scheduled_event.id;
                participant.confirm = item.confirm;
                participant.user_id = item.user.id;

                var user = this.context.users.Find(item.user.id);

                var model = new EventParticipantResponseModel(participant, user);
                particpants.Add(model);
            }

            var assigneesForDelete = this.context.event_participants
                   .Where(u => u.event_id == scheduled_event.id)
                   .ToList();
            this.context.event_participants.RemoveRange(assigneesForDelete);

            var participantsToAdd = new List<EventParticipant>();

            if (request.participants != null)
            {
                foreach (var item in particpants)
                {
                    
                    var user = this.context.users.Find(item.user.id);
                    var participant = new EventParticipant();
                    participant.event_id = scheduled_event.id;
                    participant.user_id = item.user.id;

                    this.context.event_participants.Add(participant);
                    this.context.SaveChanges();


                    var model = new EventParticipantResponseModel(participant, user);
                    model.id = participant.id;
                    response.participants.Add(model);
                }

            }

            this.context.SaveChanges();

            return Ok(response);
        }

    }

}
