import { DateTime } from "luxon";

interface LuxonDateDuration {
  years?: number;
  months?: number;
  days?: number;
}

type LuxonDateUnits =
  | "year"
  | "years"
  | "quarter"
  | "quarters"
  | "week"
  | "weeks"
  | "month"
  | "months";

export enum Comparison {
  Before = -1,
  Equal = 0,
  After = 1
}

export default class LuxonDate {
  public static fromDateTime(dt: DateTime): LuxonDate {
    return new LuxonDate(dt);
  }

  public static build(year: number, month: number, day: number): LuxonDate {
    return LuxonDate.fromDateTime(DateTime.local(year, month, day));
  }

  public static today(): LuxonDate {
    return LuxonDate.fromDateTime(DateTime.local());
  }

  public static isDate(o: any): boolean {
    return o instanceof LuxonDate;
  }

  public static restoreFromDB(ds: string): LuxonDate {
    return new LuxonDate(DateTime.fromFormat(ds, "yyyy-MM-dd"));
  }

  public static compare(a: LuxonDate, b: LuxonDate): number {
    return a.compare(b);
  }

  public year: number;
  public month: number;
  public day: number;
  public weekday: number;
  public weekNumber: number;

  private wrappedDateTime: DateTime;

  private constructor(dateTime: DateTime) {
    this.wrappedDateTime = dateTime.startOf("day");
    this.year = this.wrappedDateTime.year;
    this.month = this.wrappedDateTime.month;
    this.day = this.wrappedDateTime.day;
    this.weekday = this.wrappedDateTime.weekday;
    this.weekNumber = this.wrappedDateTime.weekNumber;
  }

  public toString() {
    return this.wrappedDateTime.toFormat("yyyy-MM-dd");
  }

  public toFormat(formatString: string) {
    return this.wrappedDateTime.toFormat(formatString);
  }

  public startOf(unit: LuxonDateUnits): LuxonDate {
    return new LuxonDate(this.wrappedDateTime.startOf(unit));
  }

  public endOf(unit: LuxonDateUnits): LuxonDate {
    return new LuxonDate(this.wrappedDateTime.endOf(unit));
  }

  public plus(duration: LuxonDateDuration): LuxonDate {
    return new LuxonDate(this.wrappedDateTime.plus(duration));
  }

  public minus(duration: LuxonDateDuration): LuxonDate {
    return new LuxonDate(this.wrappedDateTime.minus(duration));
  }

  public compare(otherDate: LuxonDate): Comparison {
    const thisKey = this.valueOf();
    const otherKey = otherDate.valueOf();
    if (thisKey < otherKey) {
      return Comparison.Before;
    } else if (thisKey > otherKey) {
      return Comparison.After;
    } else {
      return Comparison.Equal;
    }
  }

  public valueOf(): number {
    return this.year * 10000 + this.month * 100 + this.day;
  }

  public equal(otherDate: LuxonDate): boolean {
    return this.compare(otherDate) === Comparison.Equal;
  }

  public after(otherDate: LuxonDate): boolean {
    return this.compare(otherDate) === Comparison.After;
  }

  public before(otherDate: LuxonDate): boolean {
    return this.compare(otherDate) === Comparison.Before;
  }

  public castToDB(): string {
    return this.wrappedDateTime.toFormat("yyyy-MM-dd");
  }
}
