export function DURATION(milliseconds: number) {
  return {
    MILLISECOND: milliseconds,
    get SECOND() { return Math.floor(this.MILLISECOND / 1000) },
    get MINUTE() { return Math.floor(this.MILLISECOND / (1000 * 60)) },
    get HOUR() { return Math.floor(this.MILLISECOND / (1000 * 60 * 60)) },
    get DAY() { return this.HOUR / 24 },
    get WEEK() { return this.DAY / 7 }
  }
}
