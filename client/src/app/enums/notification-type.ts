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

  export function getValueByName(name: Name): Value {
    switch (name) {
      case Name.None: return Value.None;
      case Name.Info: return Value.Info;
      case Name.Warning: return Value.Warning;
      case Name.Error: return Value.Error;
      case Name.Success: return Value.Success;
      default: return Value.None;
    }
  }
}
