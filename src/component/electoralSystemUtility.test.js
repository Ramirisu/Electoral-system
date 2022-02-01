import { electoralSystem } from './electoralSystemUtility';
import ELECTION_RESULTS_DATA_JSON from './election_results.json';

test('2020 Taiwanese Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.taiwan2008(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Kuomintang', proportional_seats: 13, total_seats: 38, overhang_seats: 0 },
        { name: 'Democratic Progressive Party', proportional_seats: 13, total_seats: 61, overhang_seats: 0 },
        { name: 'New Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'People First Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Taiwan Solidarity Union', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'New Power Party', proportional_seats: 3, total_seats: 3, overhang_seats: 0 },
        { name: 'Taiwan Statebuilding Party', proportional_seats: 0, total_seats: 1, overhang_seats: 0 },
        { name: 'Taiwan People\'s Party', proportional_seats: 5, total_seats: 5, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 5, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 34, total_seats: 113, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2016 Taiwanese Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.taiwan2008(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Kuomintang', proportional_seats: 11, total_seats: 35, overhang_seats: 0 },
        { name: 'Democratic Progressive Party', proportional_seats: 18, total_seats: 68, overhang_seats: 0 },
        { name: 'New Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'People First Party', proportional_seats: 3, total_seats: 3, overhang_seats: 0 },
        { name: 'Taiwan Solidarity Union', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'New Power Party', proportional_seats: 2, total_seats: 5, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 1, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 34, total_seats: 113, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2012 Taiwanese Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.taiwan2008(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Kuomintang', proportional_seats: 16, total_seats: 64, overhang_seats: 0 },
        { name: 'Democratic Progressive Party', proportional_seats: 13, total_seats: 40, overhang_seats: 0 },
        { name: 'New Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'People First Party', proportional_seats: 2, total_seats: 3, overhang_seats: 0 },
        { name: 'Taiwan Solidarity Union', proportional_seats: 3, total_seats: 3, overhang_seats: 0 },
        { name: 'Non-Partisan Solidarity Union', proportional_seats: 0, total_seats: 2, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 1, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 34, total_seats: 113, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2008 Taiwanese Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.taiwan2008(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Kuomintang', proportional_seats: 20, total_seats: 81, overhang_seats: 0 },
        { name: 'Democratic Progressive Party', proportional_seats: 14, total_seats: 27, overhang_seats: 0 },
        { name: 'New Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'People First Party', proportional_seats: 0, total_seats: 1, overhang_seats: 0 },
        { name: 'Taiwan Solidarity Union', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Non-Partisan Solidarity Union', proportional_seats: 0, total_seats: 3, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 1, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 34, total_seats: 113, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2020 South Korean Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.southKorea2020(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Democratic Party of Korea', proportional_seats: 0, total_seats: 163, overhang_seats: 0 },
        { name: 'Platform Party', proportional_seats: 17, total_seats: 17, overhang_seats: 0 },
        { name: 'United Future Party', proportional_seats: 0, total_seats: 84, overhang_seats: 0 },
        { name: 'Future Korea Party', proportional_seats: 19, total_seats: 19, overhang_seats: 0 },
        { name: 'Justice Party', proportional_seats: 5, total_seats: 6, overhang_seats: 0 },
        { name: 'People Party', proportional_seats: 3, total_seats: 3, overhang_seats: 0 },
        { name: 'Open Democratic Party', proportional_seats: 3, total_seats: 3, overhang_seats: 0 },
        { name: 'Minsaeng Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Progressive Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 5, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 47, total_seats: 300, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2016 South Korean Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.southKorea2016(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Liberty Korea Party', proportional_seats: 17, total_seats: 122, overhang_seats: 0 },
        { name: 'People Party', proportional_seats: 13, total_seats: 38, overhang_seats: 0 },
        { name: 'Democratic Party of Korea', proportional_seats: 13, total_seats: 123, overhang_seats: 0 },
        { name: 'Justice Party', proportional_seats: 4, total_seats: 6, overhang_seats: 0 },
        { name: 'Christian Liberal Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Democratic Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 11, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 47, total_seats: 300, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2012 South Korean Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.southKorea1992(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Liberty Korea Party', proportional_seats: 25, total_seats: 152, overhang_seats: 0 },
        { name: 'Democratic United Party', proportional_seats: 21, total_seats: 127, overhang_seats: 0 },
        { name: 'Unified Progressive Party', proportional_seats: 6, total_seats: 13, overhang_seats: 0 },
        { name: 'Liberty Forward Party', proportional_seats: 2, total_seats: 5, overhang_seats: 0 },
        { name: 'Christian Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'New Progressive Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 3, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 54, total_seats: 300, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2008 South Korean Legislative Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.southKorea1992(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Grand National Party', proportional_seats: 22, total_seats: 153, overhang_seats: 0 },
        { name: 'United Democratic Party', proportional_seats: 15, total_seats: 81, overhang_seats: 0 },
        { name: 'Pro-Park Coalition', proportional_seats: 8, total_seats: 14, overhang_seats: 0 },
        { name: 'Liberty Forward Party', proportional_seats: 4, total_seats: 18, overhang_seats: 0 },
        { name: 'Democratic Labor Party', proportional_seats: 3, total_seats: 5, overhang_seats: 0 },
        { name: 'Creative Korea Party', proportional_seats: 2, total_seats: 3, overhang_seats: 0 },
        { name: 'New Progressive Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Christian Party', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 25, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 54, total_seats: 299, overhang_seats: 0 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2021 German Federal Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.germany2021(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Social Democratic Party', proportional_seats: 85, total_seats: 206, overhang_seats: 38 },
        { name: 'Christian Democratic Union', proportional_seats: 54, total_seats: 152, overhang_seats: 28 },
        { name: 'Alliance 90/The Greens', proportional_seats: 102, total_seats: 118, overhang_seats: 22 },
        { name: 'Free Democratic Party', proportional_seats: 92, total_seats: 92, overhang_seats: 17 },
        { name: 'Alternative for Germany', proportional_seats: 67, total_seats: 83, overhang_seats: 15 },
        { name: 'Christian Social Union', proportional_seats: 0, total_seats: 45, overhang_seats: 11 },
        { name: 'The Left', proportional_seats: 36, total_seats: 39, overhang_seats: 7 },
        { name: 'Free Voters', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 437, total_seats: 736, overhang_seats: 138 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});

test('2017 German Federal Election', () => {
    const election = ELECTION_RESULTS_DATA_JSON.find(element => element.name === expect.getState().currentTestName);
    expect(election).not.toBeUndefined();
    electoralSystem.germany2017(election.data, election.total_seats, election.total_proportional_votes, election.total_constituency_votes);
    const expectedSeatsAllocation = [
        { name: 'Social Democratic Party', proportional_seats: 94, total_seats: 153, overhang_seats: 24 },
        { name: 'Christian Democratic Union', proportional_seats: 15, total_seats: 200, overhang_seats: 32 },
        { name: 'Alliance 90/The Greens', proportional_seats: 66, total_seats: 67, overhang_seats: 11 },
        { name: 'Free Democratic Party', proportional_seats: 80, total_seats: 80, overhang_seats: 12 },
        { name: 'Alternative for Germany', proportional_seats: 91, total_seats: 94, overhang_seats: 14 },
        { name: 'Christian Social Union', proportional_seats: 0, total_seats: 46, overhang_seats: 7 },
        { name: 'The Left', proportional_seats: 64, total_seats: 69, overhang_seats: 11 },
        { name: 'Free Voters', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Independents', proportional_seats: 0, total_seats: 0, overhang_seats: 0 },
        { name: 'Summary', proportional_seats: 410, total_seats: 709, overhang_seats: 111 },
    ];
    expectedSeatsAllocation.forEach(obj => {
        const party = election.data.find(element => element.name === obj.name);
        expect(party).not.toBeUndefined();
        expect(party.proportional_seats).toBe(obj.proportional_seats);
        expect(party.total_seats).toBe(obj.total_seats);
        expect(party.overhang_seats).toBe(obj.overhang_seats);
    });
});
