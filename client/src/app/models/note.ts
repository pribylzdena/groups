export class Note {
  id: number;
  name: string;
  value: string;
  color: string;

  constructor(id: number, name: string, value: string, color: string) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.color = color;
  }

  getSubstringValue(length: number) {
    return this.value.length > length ? this.value.slice(0, length) + '…' : this.value;
  }
}
