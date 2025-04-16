export class WeatherForecast {
  date: string;         // Datum ve formátu 'YYYY-MM-DD'
  temperatureC: number; // Teplota v Celsius
  temperatureF: number; // Teplota v Fahrenheit
  summary: string;      // Stručný popis počasí

  constructor(date: string, temperatureC: number, temperatureF: number, summary: string) {
    this.date = date;
    this.temperatureC = temperatureC;
    this.temperatureF = temperatureF;
    this.summary = summary;
  }
}
