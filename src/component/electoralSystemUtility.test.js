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
