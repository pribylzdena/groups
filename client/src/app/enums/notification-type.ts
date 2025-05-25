export namespace NotificationType {
  export enum Name {
    None = 'None',
    Info = 'Info',
    Warning = 'Warning',
    Error = 'Error',
    Success = 'Success'
  }

  export enum Value {
    None = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Success = 4
  }

  export function getAllNames(): Name[] {
    return Object.values(Name);
  }

  export function getNameByValue(value: Value): Name {
    switch (value) {
      case Value.None: return Name.None;
      case Value.Info: return Name.Info;
      case Value.Warning: return Name.Warning;
      case Value.Error: return Name.Error;
      case Value.Success: return Name.Success;
      default: return Name.None;
    }
  }


  export function getValueByName(name: string): number {
    switch (name) {
      case 'None': return 0;
      case 'Info': return 1;
      case 'Warning': return 2;
      case 'Error': return 3;
      case 'Success': return 4;
      default: return 0;
    }
  }
}
