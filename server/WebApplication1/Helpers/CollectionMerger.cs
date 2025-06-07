using WebApplication1.Models;
using WebApplication1.RequestModels;

public static class CollectionHelper
{
    public static (List<TaskComment> toSave, List<int> toDelete) MergeComments(
        List<TaskComment> existingComments,
        List<TaskCommentRequest> newComments,
        int taskId,
        int userId)
    {
        var toSave = new List<TaskComment>();
        var toDelete = new List<int>();

        foreach (var comment in newComments)
        {
            if (comment.id > 0)
            {
                var existing = existingComments.FirstOrDefault(c => c.id == comment.id);
                if (existing != null)
                {
                    existing.value = comment.value;
                    existing.respond_to = comment.respondTo?.id;
                    existing.updated_by = userId;
                    existing.updated_at = DateTime.UtcNow;
                    toSave.Add(existing);
                }
            }
            else
            {
                toSave.Add(new TaskComment
                {
                    value = comment.value,
                    task_id = taskId,
                    respond_to = comment.respondTo?.id,
                    created_by = userId,
                    updated_by = userId,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                });
            }
        }

        foreach (var existing in existingComments)
        {
            if (!toSave.Any(c => c.id == existing.id))
            {
                toDelete.Add(existing.id);
            }
        }

        return (toSave, toDelete);
    }
}