using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class EventParticipantResponseModel
    {
        public int id { get; set; }
        public bool confirm { get; set; }
        public UserResponseModel user { get; set; }

        public EventParticipantResponseModel(EventParticipant model, User user)
        {
            this.id = model.Id;
            this.confirm = model.confirm;
            this.user = new UserResponseModel(user);
        }
    }
}
