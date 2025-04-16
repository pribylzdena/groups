using WebApplication1.Controllers;
using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class GroupResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> members { get; set; }


        public GroupResponseModel(groups group)
        {
            Id = group.id;
            Name = group.name;
            members = [];
        }

        
    }
}
