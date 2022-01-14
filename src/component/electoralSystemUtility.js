
const refreshData = (data) => {
    data = JSON.parse(JSON.stringify(data));

    data.forEach(obj => {
        obj.qualified_proportional_vote_percentage = 0.0;
        obj.remaining_proportional_seats = 0;
        obj.expected_proportional_seats = 0;
        obj.proportional_seats = 0;
        obj.total_seats = 0;
        obj.overhang_seats = 0;
        obj.total_seats_percentage = 0.0;
    })

    return data;
}

const calculateProportionalVotePercentage = (data) => {
    const TOTAL_VOTES = data.map(obj => obj.proportional_votes).reduce((prev, curr) => prev + curr);
    data.forEach(obj => { obj.proportional_vote_percentage = obj.proportional_votes / TOTAL_VOTES });
    return data;
}

export function electoralSystemTaiwan2008(data, TOTAL_SEATS, QUALIFIED_THRESHOLD) {

    data = refreshData(data);

    calculateProportionalVotePercentage(data);

    const PROPORTIONAL_SEATS = TOTAL_SEATS - data.map(obj => obj.constituency_seats).reduce((prev, curr) => prev + curr);
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = data
        .map(obj => obj.proportional_vote_percentage)
        .filter(value => value >= QUALIFIED_THRESHOLD)
        .reduce((prev, curr) => prev + curr);

    // calculate qualified proportional vote
    data.forEach(obj => {
        if (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD) {
            obj.qualified_proportional_vote_percentage = obj.proportional_vote_percentage / QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE;
        } else {
            obj.qualified_proportional_vote_percentage = 0;
        }
    });

    // calculate proportional seats
    data.forEach(obj => {
        const proportional_seats = obj.qualified_proportional_vote_percentage * PROPORTIONAL_SEATS;
        obj.proportional_seats = Math.floor(proportional_seats);
        obj.remaining_proportional_seats = proportional_seats - obj.proportional_seats;
    });

    // calculate remaining proportional seats
    const remaining_seats = PROPORTIONAL_SEATS - data.map(obj => obj.proportional_seats).reduce((prev, curr) => prev + curr);
    for (let i = 0; i < remaining_seats; i++) {
        const max_remaining_proportional_seats = Math.max.apply(Math, data.map(obj => obj.remaining_proportional_seats));
        const index = data.findIndex(obj => obj.remaining_proportional_seats === max_remaining_proportional_seats);
        data[index].proportional_seats++;
        data[index].remaining_proportional_seats--;
    }

    data.forEach(obj => {
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    return data;
}

export function electoralSystemGermany1949(data, TOTAL_SEATS, QUALIFIED_THRESHOLD) {

    data = refreshData(data);

    calculateProportionalVotePercentage(data);

    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = data
        .map(obj => obj.proportional_vote_percentage)
        .filter(value => value >= QUALIFIED_THRESHOLD)
        .reduce((prev, curr) => prev + curr);

    // calculate qualified proportional vote
    data.forEach(obj => {
        if (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD) {
            obj.qualified_proportional_vote_percentage = obj.proportional_vote_percentage / QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE;
        } else {
            obj.qualified_proportional_vote_percentage = 0;
        }

    });

    // calculate proportional seats
    data.forEach(obj => {
        const expected_proportional_seats = obj.qualified_proportional_vote_percentage * TOTAL_SEATS;
        obj.expected_proportional_seats = Math.floor(expected_proportional_seats);
        obj.remaining_proportional_seats = expected_proportional_seats - obj.expected_proportional_seats;
    });

    // calculate remaining proportional seats
    const remaining_seats = TOTAL_SEATS - data.map(obj => obj.expected_proportional_seats).reduce((prev, curr) => prev + curr);
    for (let i = 0; i < remaining_seats; i++) {
        const max_remaining_proportional_seats = Math.max.apply(Math, data.map(obj => obj.remaining_proportional_seats));
        const index = data.findIndex(obj => obj.remaining_proportional_seats === max_remaining_proportional_seats);
        data[index].expected_proportional_seats++;
        data[index].remaining_proportional_seats--;
    }

    data.forEach(obj => {
        if (obj.expected_proportional_seats < obj.constituency_seats) {
            obj.proportional_seats = 0;
        } else {
            obj.proportional_seats = obj.expected_proportional_seats - obj.constituency_seats;
        }
    });

    data.forEach(obj => {
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
        obj.overhang_seats = obj.total_seats - obj.expected_proportional_seats;
    });

    return data;
}

export function electoralSystemGermany2017(data, TOTAL_SEATS, QUALIFIED_THRESHOLD) {

    data = refreshData(data);

    calculateProportionalVotePercentage(data);

    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = data
        .map(obj => obj.proportional_vote_percentage)
        .filter(value => value >= QUALIFIED_THRESHOLD)
        .reduce((prev, curr) => prev + curr);

    // calculate qualified proportional vote
    data.forEach(obj => {
        if (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.always_qualified_on_proportional_votes) {
            obj.qualified_proportional_vote_percentage = obj.proportional_vote_percentage / QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE;
        } else {
            obj.qualified_proportional_vote_percentage = 0;
        }

    });

    // calculate proportional seats
    const NEW_TOTAL_SEATS = Math.ceil(Math.max.apply(Math, data.map(obj => {
        if (obj.qualified_proportional_vote_percentage !== 0) {
            return obj.constituency_seats / obj.qualified_proportional_vote_percentage;
        }
        return 0;
    })));

    data.forEach(obj => {
        obj.expected_proportional_seats = Math.floor(obj.qualified_proportional_vote_percentage * TOTAL_SEATS);
        const new_expected_proportional_seats = obj.qualified_proportional_vote_percentage * NEW_TOTAL_SEATS;
        obj.new_expected_proportional_seats = Math.floor(new_expected_proportional_seats);
        obj.remaining_proportional_seats = new_expected_proportional_seats - obj.new_expected_proportional_seats;
    });

    // calculate remaining proportional seats
    const remaining_seats = NEW_TOTAL_SEATS - data.map(obj => obj.new_expected_proportional_seats).reduce((prev, curr) => prev + curr);
    for (let i = 0; i < remaining_seats; i++) {
        const max_remaining_proportional_seats = Math.max.apply(Math, data.map(obj => obj.remaining_proportional_seats));
        const index = data.findIndex(obj => obj.remaining_proportional_seats === max_remaining_proportional_seats);
        data[index].new_expected_proportional_seats++;
        data[index].remaining_proportional_seats--;
    }

    data.forEach(obj => {
        if (obj.new_expected_proportional_seats < obj.constituency_seats) {
            obj.proportional_seats = 0;
        } else {
            obj.proportional_seats = obj.new_expected_proportional_seats - obj.constituency_seats;
        }
    });

    data.forEach(obj => {
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS;
        obj.overhang_seats = obj.total_seats - obj.expected_proportional_seats;
    });

    return data;
}
