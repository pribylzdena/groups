using Microsoft.Extensions.Logging;
using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class ScheduledEvent
    {
        public int id { get; set; }
        public string name { get; set; }
        public DateTime startsAt { get; set; }
        public DateTime endsAt { get; set; }
        public int status { get; set; }
        public string? color { get; set; }
        public List<EventParticipants> participants { get; set; }

        public ScheduledEvent(ScheduledEvents events)
        {
            this.id = events.id;
            this.name = events.name;
            this.startsAt = events.starts_at;
            this.endsAt = events.starts_at;
            this.status = events.status;
            this.color = events.color;
            this.participants = [];
        }
    }

}
