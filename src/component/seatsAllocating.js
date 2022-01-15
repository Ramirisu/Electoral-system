import _ from 'lodash'

const hareQuota = (votes, TOTAL_SEATS) => {
    const TOTAL_VOTES = _.sum(votes);
    const DIVISOR = Math.ceil(TOTAL_VOTES / TOTAL_SEATS);

    let seats = [];
    let remainder = [];
    votes.forEach((value, index) => {
        const seatsWithFractional = value / DIVISOR;
        seats[index] = Math.floor(seatsWithFractional);
        remainder[index] = seatsWithFractional - seats[index];
    });

    const remainingSeats = TOTAL_SEATS - _.sum(seats);
    for (let i = 0; i < remainingSeats; ++i) {
        const index = remainder.indexOf(Math.max(...remainder));
        remainder[index]--;
        seats[index]++;
    }

    return seats;
}

const saintLague = (votes, TOTAL_SEATS) => {
    const TOTAL_VOTES = _.sum(votes);
    const INITIAL_DIVISOR = Math.ceil(TOTAL_VOTES / TOTAL_SEATS);

    let seats = [];
    for (let divisor = INITIAL_DIVISOR; ;) {
        seats = votes.map(value => Math.round(value / divisor));
        const sum = _.sum(seats);
        if (sum === TOTAL_SEATS) {
            break;
        }
        if (sum < TOTAL_SEATS) {
            divisor--;
        } else {
            divisor++;
        }
    }

    return seats;
}

export const seatsAllocating = {
    hareQuota,
    saintLague
};
