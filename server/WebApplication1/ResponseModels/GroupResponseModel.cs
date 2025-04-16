namespace WebApplication1.ResponseModels
{
    public class GroupResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> members {  get; set; }
    }
}
