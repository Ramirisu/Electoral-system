import _ from 'lodash';

const refreshData = (data) => {
    data = JSON.parse(JSON.stringify(data));

    data.forEach(obj => {
        obj.qualified_proportional_vote_percentage = 0.0;
        obj.remaining_proportional_seats = 0;
        obj.original_expected_proportional_seats = 0;
        obj.expected_proportional_seats = 0;
        obj.proportional_seats = 0;
        obj.total_seats = 0;
        obj.overhang_seats = 0;
        obj.total_seats_percentage = 0.0;
    })

    return data;
}

const calculateProportionalVotePercentage = (data, TOTAL_PROPORTIONAL_VOTES) => {
    data.forEach(obj => { obj.proportional_vote_percentage = obj.proportional_votes / TOTAL_PROPORTIONAL_VOTES });
    return data;
}

const calculateQualifiedProportionalVotePercentage = (data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified) => {
    data.filter(obj => isQualified(obj)).forEach(obj => { obj.qualified_proportional_vote_percentage = obj.proportional_vote_percentage / QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE; });
    return data;
}

const calculateProportionalSeatsByHareQuota = (data, SEATS) => {
    // integer
    data.forEach(obj => {
        const expected_proportional_seats = obj.qualified_proportional_vote_percentage * SEATS;
        obj.expected_proportional_seats = Math.floor(expected_proportional_seats);
        obj.remaining_proportional_seats = expected_proportional_seats - obj.expected_proportional_seats;
    });

    // fractional remainder
    const remaining_seats = SEATS - _.sum(data.map(obj => obj.expected_proportional_seats));
    for (let i = 0; i < remaining_seats; i++) {
        const max_remaining_proportional_seats = Math.max(...data.map(obj => obj.remaining_proportional_seats));
        const index = data.findIndex(obj => obj.remaining_proportional_seats === max_remaining_proportional_seats);
        data[index].expected_proportional_seats++;
        data[index].remaining_proportional_seats--;
    }
}

const calculateProportionalSeatsByDHondt = (data, SEATS) => {
    let divider = Array(data.length).fill(1.0);
    for (let i = 0; i < SEATS; ++i) {
        const votes = data.map((obj, index) => obj.qualified_proportional_vote_percentage > 0 ? obj.proportional_votes / divider[index] : 0);
        const index = votes.indexOf(Math.max(...votes));
        divider[index]++;
        data[index].expected_proportional_seats++;
    }
}

const removeSummary = (data) => {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].is_summary) {
            data.splice(i, 1);
        }
    }

    return data;
}

const getSummary = (data) => {
    return {
        is_summary: true,
        id: '-',
        name: 'Summary',
        full_name: 'Summary',
        proportional_votes: _.sum(data.map(obj => obj.proportional_votes)),
        proportional_vote_percentage: _.sum(data.map(obj => obj.proportional_vote_percentage)),
        qualified_proportional_vote_percentage: _.sum(data.map(obj => obj.qualified_proportional_vote_percentage)),
        expected_proportional_seats: _.sum(data.map(obj => obj.expected_proportional_seats)),
        proportional_seats: _.sum(data.map(obj => obj.proportional_seats)),
        constituency_seats: _.sum(data.map(obj => obj.constituency_seats)),
        total_seats: _.sum(data.map(obj => obj.total_seats)),
        overhang_seats: _.sum(data.map(obj => obj.overhang_seats)),
        total_seats_percentage: _.sum(data.map(obj => obj.total_seats_percentage)),
    };
}

export function electoralSystemTaiwan2008(data, TOTAL_SEATS, QUALIFIED_THRESHOLD, TOTAL_PROPORTIONAL_VOTES) {

    data = refreshData(data);
    removeSummary(data);

    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => {
        return obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD;
    }

    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    calculateProportionalSeatsByHareQuota(data, PROPORTIONAL_SEATS);

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

export function electoralSystemJapan1994(data, TOTAL_SEATS, QUALIFIED_THRESHOLD, TOTAL_PROPORTIONAL_VOTES) {

    data = refreshData(data);
    removeSummary(data);

    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => { return obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD; }
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    calculateProportionalSeatsByDHondt(data, PROPORTIONAL_SEATS);

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

export function electoralSystemGermany1949(data, TOTAL_SEATS, QUALIFIED_THRESHOLD, TOTAL_PROPORTIONAL_VOTES) {

    data = refreshData(data);
    removeSummary(data);

    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => { return obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3; };
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    calculateProportionalSeatsByHareQuota(data, TOTAL_SEATS);

    data.forEach(obj => { obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats) });

    // total seats
    data.forEach(obj => {
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
    });

    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => {
        obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS;
        obj.overhang_seats = obj.total_seats - obj.expected_proportional_seats;
    });

    data.push(getSummary(data));

    return data;
}

export function electoralSystemGermany2009(data, TOTAL_SEATS, QUALIFIED_THRESHOLD, TOTAL_PROPORTIONAL_VOTES) {

    data = refreshData(data);
    removeSummary(data);

    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => { return obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3; };
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    data.forEach(obj => {
        obj.expected_proportional_seats = Math.round(obj.qualified_proportional_vote_percentage * TOTAL_SEATS);
        obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats);
    });

    // total seats
    data.forEach(obj => {
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
    });

    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => {
        obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS;
        obj.overhang_seats = obj.total_seats - obj.expected_proportional_seats;
    });

    data.push(getSummary(data));

    return data;
}

export function electoralSystemGermany2013(data, TOTAL_SEATS, QUALIFIED_THRESHOLD, TOTAL_PROPORTIONAL_VOTES) {

    data = refreshData(data);
    removeSummary(data);

    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => { return obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes; }
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    data.forEach(obj => { obj.original_expected_proportional_seats = Math.round(obj.qualified_proportional_vote_percentage * TOTAL_SEATS); });
    const NEW_TOTAL_SEATS = Math.ceil(Math.max(TOTAL_SEATS, ...data.map(obj => obj.qualified_proportional_vote_percentage > 0 ? obj.constituency_seats / obj.qualified_proportional_vote_percentage : 0)));
    calculateProportionalSeatsByHareQuota(data, NEW_TOTAL_SEATS);

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats - obj.constituency_seats;
        obj.total_seats = obj.expected_proportional_seats;
        obj.overhang_seats = obj.total_seats - obj.original_expected_proportional_seats;
    });

    data.forEach(obj => {
        obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}
