import _ from 'lodash'

const hareQuota = (votes, TOTAL_SEATS) => {
    const TOTAL_VOTES = _.sum(votes);
    const DIVISOR = TOTAL_VOTES / TOTAL_SEATS;

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

const dHondt = (votes, TOTAL_SEATS) => {
    let divisor = Array(votes.length).fill(1.0);
    let seats = Array(votes.length).fill(0);
    for (let i = 0; i < TOTAL_SEATS; ++i) {
        const votesAfterDivided = votes.map((value, index) => value / divisor[index]);
        const index = votesAfterDivided.indexOf(Math.max(...votesAfterDivided));
        divisor[index]++;
        seats[index]++;
    }

    return seats;
}

const saintLague = (votes, TOTAL_SEATS) => {
    const TOTAL_VOTES = _.sum(votes);
    const minDivisor = TOTAL_VOTES / (TOTAL_SEATS + votes.length);
    const maxDivisor = TOTAL_VOTES / Math.max(1, TOTAL_SEATS - votes.length);
    const minSeats = votes.map(value => Math.round(value / maxDivisor));
    const maxSeats = votes.map(value => Math.round(value / minDivisor));
    const divisors = _.flatMap(votes.map((vote, index) => {
        const minSeat = Math.max(1, minSeats[index]);
        const maxSeat = maxSeats[index];
        return _.range(minSeat, maxSeat).map(seat => {
            return { index, divisor: vote / (seat + 0.5) };
        });
    })).sort((a, b) => a.divisor === b.divisor ? 0 : a.divisor < b.divisor ? 1 : -1)

    let seats = minSeats;
    const REMAINING_SEATS = TOTAL_SEATS - _.sum(seats);
    _.range(0, REMAINING_SEATS).forEach(index => { seats[divisors[index].index]++ });

    return seats;
}

const saintLagueMinSeatsRequired = (votes, minSeats, TOTAL_SEATS, MINIMUM_EXTRA_SEATS_INCREASED) => {
    const SUBTRAHEND = MINIMUM_EXTRA_SEATS_INCREASED ? 0.5 : 0.0;
    const seats = saintLague(votes, TOTAL_SEATS).map((value, index) => Math.max(value, minSeats[index]));
    const minDivisor = Math.min(
        ...votes
            .map((value, index) => ({ vote: value, seat: seats[index] }))
            .filter(obj => obj.vote > 0 && obj.seat > 0).map(obj => obj.vote / (obj.seat - SUBTRAHEND))
    );

    return votes.map(value => Math.round(value / minDivisor));
}

export const seatsAllocation = {
    hareQuota,
    dHondt,
    saintLague,
    saintLagueMinSeatsRequired,
};
