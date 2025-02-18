function microsToSecondsAndMillis(micros) {
    var seconds = Math.floor(micros / 1000000);
    var millis = Math.floor(micros / 1000) - seconds * 1000;
    var mic = micros - seconds * 1000000 - millis * 1000;
    ////////////////////////////////////////////////////
    if (seconds == 0) {
        if (millis == 0) {
            return Math.round(mic) + "us"
        }
        return millis + "ms " + Math.round(mic) + "us"
    }
    ////////////////////////////////////////////////////
    return seconds + "s " + millis + "ms " + Math.round(mic) + "us"
}

function microsToSeconds(micros) {
    var seconds = Math.floor(micros / 1000000);
    return seconds
}

function microsToMillis(micros) {
    var seconds = Math.floor(micros / 1000000);
    var millis = Math.floor(micros / 1000) - seconds * 1000;
    return millis
}

function microsToRemainingMicros(micros) {
    var seconds = Math.floor(micros / 1000000);
    var millis = Math.floor(micros / 1000) - seconds * 1000;
    var mic = micros - seconds * 1000000 - millis * 1000;
    return mic
}

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
