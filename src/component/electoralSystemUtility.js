import _ from 'lodash';
import { seatsAllocation } from './seatsAllocation';

const removeSummary = (data) => {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].is_summary) {
            data.splice(i, 1);
        }
    }

    return data;
}

const initData = (data) => {
    removeSummary(data);
    data.forEach(obj => {
        obj.qualified_proportional_vote_percentage = 0.0;
        obj.remaining_proportional_seats = 0;
        obj.original_expected_proportional_seats = 0;
        obj.expected_proportional_seats = 0;
        obj.proportional_seats = 0;
        obj.total_seats = 0;
        obj.overhang_seats = 0;
        obj.total_seats_percentage = 0.0;
    });
}

const calculateProportionalVotePercentage = (data, TOTAL_PROPORTIONAL_VOTES) => {
    data.forEach(obj => { obj.proportional_vote_percentage = obj.proportional_votes / TOTAL_PROPORTIONAL_VOTES });
    return data;
}

const calculateQualifiedProportionalVotePercentage = (data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified) => {
    data.filter(obj => isQualified(obj)).forEach(obj => {
        obj.qualified_proportional_vote_percentage = obj.proportional_vote_percentage / QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE;
        obj.is_qualified = true;
    });
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

function electoralSystemTaiwan2008(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents && (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    seatsAllocation.hareQuota(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), PROPORTIONAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

function electoralSystemJapan1994(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.02;
    const isQualified = (obj) => !obj.is_independents && (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 2)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    seatsAllocation.dHondt(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), PROPORTIONAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

function electoralSystemSouthKorea1988(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const isQualified = (obj) => !obj.is_independents && (obj.constituency_seats >= 5)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    seatsAllocation.hareQuota(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), PROPORTIONAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

function electoralSystemSouthKorea1992(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.03;
    const isQualified = (obj) => !obj.is_independents && (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 5)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    seatsAllocation.hareQuota(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), PROPORTIONAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

function electoralSystemSouthKorea2016(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents && (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 5)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const PROPORTIONAL_SEATS = TOTAL_SEATS - _.sum(data.map(obj => obj.constituency_seats));
    seatsAllocation.hareQuota(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), PROPORTIONAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = obj.expected_proportional_seats;
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.total_seats_percentage = obj.total_seats / TOTAL_SEATS;
    });

    data.push(getSummary(data));

    return data;
}

function electoralSystemGermany1949(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    seatsAllocation.dHondt(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

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

function electoralSystemGermany1986(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    seatsAllocation.hareQuota(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

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

function electoralSystemGermany2008(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    seatsAllocation.saintLague(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].expected_proportional_seats = seats; });
    console.log(data.map(obj => obj.expected_proportional_seats));

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats);
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.overhang_seats = obj.total_seats - obj.expected_proportional_seats;
    });

    // constituency seats that didn't participate proportional seats allocation should be counted for calculating the total seats percentage
    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => { obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS; });

    data.push(getSummary(data));

    return data;
}

function electoralSystemGermany2013(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const MINIMUM_EXTRA_SETAS_INCREASED = true;
    const ALLOWED_OVERHANG_SEATS = 0;
    seatsAllocation.saintLague(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].original_expected_proportional_seats = seats; });
    seatsAllocation.saintLagueMinSeatsRequired(
        data.map(obj => obj.is_qualified ? obj.proportional_votes : 0),
        data.map(obj => obj.is_qualified ? Math.max(0, obj.constituency_seats - ALLOWED_OVERHANG_SEATS) : 0),
        TOTAL_SEATS,
        MINIMUM_EXTRA_SETAS_INCREASED
    ).forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats);
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.overhang_seats = obj.total_seats - obj.original_expected_proportional_seats;
    });

    // constituency seats that didn't participate proportional seats allocation should be counted for calculating the total seats percentage
    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => { obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS; });

    data.push(getSummary(data));

    return data;
}

function electoralSystemGermany2017(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const MINIMUM_EXTRA_SETAS_INCREASED = false;
    const ALLOWED_OVERHANG_SEATS = 0;
    seatsAllocation.saintLague(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].original_expected_proportional_seats = seats; });
    seatsAllocation.saintLagueMinSeatsRequired(
        data.map(obj => obj.is_qualified ? obj.proportional_votes : 0),
        data.map(obj => obj.is_qualified ? Math.max(0, obj.constituency_seats - ALLOWED_OVERHANG_SEATS) : 0),
        TOTAL_SEATS,
        MINIMUM_EXTRA_SETAS_INCREASED
    ).forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats);
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.overhang_seats = obj.total_seats - obj.original_expected_proportional_seats;
    });

    // constituency seats that didn't participate proportional seats allocation should be counted for calculating the total seats percentage
    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => { obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS; });

    data.push(getSummary(data));

    return data;
}

function electoralSystemGermany2021(data, TOTAL_SEATS, TOTAL_PROPORTIONAL_VOTES, TOTAL_CONSTITUENCY_VOTES) {

    initData(data);
    calculateProportionalVotePercentage(data, TOTAL_PROPORTIONAL_VOTES);

    const QUALIFIED_THRESHOLD = 0.05;
    const isQualified = (obj) => !obj.is_independents &&
        (obj.proportional_vote_percentage >= QUALIFIED_THRESHOLD || obj.constituency_seats >= 3 || obj.always_qualified_on_proportional_votes)
    const QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE = _.sum(data.filter(obj => isQualified(obj)).map(obj => obj.proportional_vote_percentage));
    calculateQualifiedProportionalVotePercentage(data, QUALIFIED_PROPORTIONAL_VOTE_PERCENTAGE, isQualified);

    // proportional seats
    const MINIMUM_EXTRA_SETAS_INCREASED = true;
    const ALLOWED_OVERHANG_SEATS = 3;
    seatsAllocation.saintLague(data.map(obj => obj.is_qualified ? obj.proportional_votes : 0), TOTAL_SEATS)
        .forEach((seats, index) => { data[index].original_expected_proportional_seats = seats; });
    seatsAllocation.saintLagueMinSeatsRequired(
        data.map(obj => obj.is_qualified ? obj.proportional_votes : 0),
        data.map(obj => obj.is_qualified ? Math.max(0, obj.constituency_seats - ALLOWED_OVERHANG_SEATS) : 0),
        TOTAL_SEATS,
        MINIMUM_EXTRA_SETAS_INCREASED
    ).forEach((seats, index) => { data[index].expected_proportional_seats = seats; });

    // total seats
    data.forEach(obj => {
        obj.proportional_seats = Math.max(0, obj.expected_proportional_seats - obj.constituency_seats);
        obj.total_seats = obj.proportional_seats + obj.constituency_seats;
        obj.overhang_seats = obj.total_seats - obj.original_expected_proportional_seats;
    });

    // constituency seats that didn't participate proportional seats allocation should be counted for calculating the total seats percentage
    const NEW_TOTAL_SEATS = _.sum(data.map(obj => obj.total_seats));
    data.forEach(obj => { obj.total_seats_percentage = obj.total_seats / NEW_TOTAL_SEATS; });

    data.push(getSummary(data));

    return data;
}

export const electoralSystem = {
    taiwan2008: electoralSystemTaiwan2008,
    japan1994: electoralSystemJapan1994,
    southKorea1988: electoralSystemSouthKorea1988,
    southKorea1992: electoralSystemSouthKorea1992,
    southKorea2016: electoralSystemSouthKorea2016,
    germany1949: electoralSystemGermany1949,
    germany1986: electoralSystemGermany1986,
    germany2008: electoralSystemGermany2008,
    germany2013: electoralSystemGermany2013,
    germany2017: electoralSystemGermany2017,
    germany2021: electoralSystemGermany2021,
};
