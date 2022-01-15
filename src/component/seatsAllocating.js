import _ from 'lodash'

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
    saintLague: saintLague,
};
