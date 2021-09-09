var days = {
    saturday: {
        previous: "friday",
        begin: 1,
        size: 48,
        value: "saturday",
        next: "sunday",
    },
    sunday: {
        previous: "saturday",
        begin: 49,
        size: 34,
        value: "sunday",
        next: "monday",
    },
    monday: {
        previous: "sunday",
        begin: 83,
        size: 31,
        value: "monday",
        next: "tuesday",
    },
    tuesday: {
        previous: "monday",
        begin: 114,
        size: 33,
        value: "tuesday",
        next: "wednesday",
    },
    wednesday: {
        previous: "tuesday",
        begin: 147,
        size: 22,
        value: "wednesday",
        next: "thursday",
    },
    thursday: {
        previous: "wednesday",
        begin: 169,
        size: 15,
        value: "thursday",
        next: "friday",
    },
    friday: {
        previous: "thursday",
        begin: 184,
        size: 13,
        value: "friday",
        next: "saturday",
    }
}

export default days;