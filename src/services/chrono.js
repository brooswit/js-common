class Chrono {
    async delay (time) {
        return new Promise((resolve) => { setTimeout(resolve, time) })
    }

    get millisecond() { return 1 }
    get milliseconds() { return this.millisecond }

    get second() { return 1000 * this.milliseconds }
    get seconds() { return this.second }

    get minute() { return 60 * this.seconds }
    get minutes() { return this.minute }

    get hour() { return 60 * this.minutes }
    get hours() { return this.hour }

    get day() { return 24 * this.hours }
    get days() { return this.day }

    get week() { return 7 * this.days }
    get weeks() { return this.week }

    get month() { return 30 * this.days }
    get months() { return this.month }

    get year() { return 365 * this.days }
    get years() { return this.year }
}


module.exports = chrono = new Chrono()
