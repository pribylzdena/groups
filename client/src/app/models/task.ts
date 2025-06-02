import {User} from '@models/user';
import {TaskComment} from '@models/task-comment';

export class Task {
  public id: number;
  public name: string;
  public status: string;
  public deadline: Date;
  public color: string;
  public priority: string;

  public reminderAt?: Date;
  public description?: string;

  public parent?: Task|null;
  public assignees?: User[];
  public comments? : TaskComment[];
  constructor(
    id: number,
    name: string,
    status: string,
    deadline: Date,
    color: string,
    priority: string,
    description?: string,
    reminderAt?: Date,
    parent?: Task,
    assignees?: User[],
    comments?: TaskComment[]
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.deadline = deadline;
    this.color = color;
    this.priority = priority;``

    this.description = description;

    this.parent = parent;
    this.reminderAt = reminderAt;
    this.assignees = assignees;
    this.comments = comments;
  }
}
