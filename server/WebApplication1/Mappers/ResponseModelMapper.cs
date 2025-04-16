using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.Mappers
{
    public class ResponseModelMapper
    {
        public static GroupResponseModel MapToGroupResponseModel(groups data, GroupResponseModel instance)
        {
            instance.Id = data.id;
            instance.Name = data.name;
            instance.members = [];

            return instance;
        }
    }
}
