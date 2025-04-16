using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class EventParticipantResponseModel
    {
        public int id { get; set; }
        public bool confirm { get; set; }
        public User user { get; set; }
    }
}
