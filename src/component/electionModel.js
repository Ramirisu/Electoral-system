
export const electionModelTaiwan2008 = (data, PROPORTIONAL_SEATS, QUALIFIED_THREASHOLD) => {

    const qualified_proportional_vote_total =
        data
            .map(obj => obj.proportional_vote)
            .filter(value => value >= QUALIFIED_THREASHOLD)
            .reduce((prev, curr) => prev + curr);

    data.forEach(obj => {
        if (obj.proportional_vote >= QUALIFIED_THREASHOLD) {
            obj.qualified_proportional_vote = obj.proportional_vote / qualified_proportional_vote_total;
        } else {
            obj.qualified_proportional_vote = 0;
        }

        const proportional_seats = obj.qualified_proportional_vote * PROPORTIONAL_SEATS;
        obj.proportional_seats = Math.floor(proportional_seats);
        obj.remaining_proportional_seats = proportional_seats - obj.proportional_seats;
    });

    const remaining_seats = PROPORTIONAL_SEATS - data.map(obj => obj.proportional_seats).reduce((prev, curr) => prev + curr);
    for (let i = 0; i < remaining_seats; i++) {
        const max_remaining_proportional_seats = Math.max.apply(Math, data.map(obj => obj.remaining_proportional_seats));
        const index = data.findIndex(obj => obj.remaining_proportional_seats === max_remaining_proportional_seats);
        data[index].proportional_seats++;
        data[index].remaining_proportional_seats--;
    }

    data.forEach(obj => { obj.total_seats = obj.proportional_seats + obj.constituency_seats; });

    return data;
};
