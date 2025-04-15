export class TaskComment {
  constructor(
    public id: number,
    public value: string,
    public respondTo: number,
  ) {}
}
