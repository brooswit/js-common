module.exports = async function delay (time) {
    return new Promise((resolve) => { setTimeout(resolve, time) })
}

delay.milliseconds = delay.mellisecond = 1
delay.second = delay.seconds = delay.milliseconds * 1000
delay.minute = delay.minutes = delay.seconds * 60
delay.hour = delay.hours = delay.minutes * 60
delay.day = delay.days = delay.hours * 24
delay.week = delay.weeks = delay.days * 7

delay.month = delay.months = delay.days * 30
delay.year = delay.years = delay.days * 365
