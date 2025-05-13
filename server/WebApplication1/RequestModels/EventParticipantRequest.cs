namespace WebApplication1.RequestModels
{
    public class EventParticipantRequest
    {
        public bool confirm { get; set; }
        public UserRequestModel? user { get; set; }
    }
}
