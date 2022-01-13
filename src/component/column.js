export const COLUMNS = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'Party',
        accessor: 'party',
    },
    {
        Header: 'Proportional Votes (%)',
        accessor: 'proportional_vote',
        Cell: ({ value }) => { return (100 * value).toFixed(2); },
    },
    {
        Header: 'Qualified Proportional Votes (%)',
        accessor: 'qualified_proportional_vote',
    },
    {
        Header: 'Proportional Seats',
        accessor: 'proportional_seats',
    },
    {
        Header: 'Constituency Seats',
        accessor: 'constituency_seats',
    },
    {
        Header: 'Total Seats',
        accessor: 'total_seats',
    },
];
