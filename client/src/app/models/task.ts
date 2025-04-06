export class Task {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public priority: string,
    public status: string,
    public color: string,
    public deadline: Date,
    public reminderAt: Date
  ) {}
}
