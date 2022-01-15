import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { electoralSystemGermany1949, electoralSystemGermany2009, electoralSystemGermany2013, electoralSystemGermany2021, electoralSystemJapan1994, electoralSystemTaiwan2008, } from './electoralSystemUtility';
import TW_LEGISLATIVE_ELECTION_DATA_JSON from './election_results.json';
import './ElectoralSystem.css';
import _ from 'lodash';

const formatPercentage = (value) => {
    return (100 * parseFloat(value)).toFixed(2) + ' %';
}

const ELECTORAL_SYSTEMS = [
    { name: 'Taiwan (2008 ~ Present) (MMM)', handler: electoralSystemTaiwan2008, },
    { name: 'Japan (1994 ~ Present) (MMM)', handler: electoralSystemJapan1994, },
    { name: 'Germany (1949 ~ 2008) (MMPR)', handler: electoralSystemGermany1949, },
    { name: 'Germany (2009 ~ 2012) (MMPR)', handler: electoralSystemGermany2009, },
    { name: 'Germany (2013 ~ 2020) (MMPR)', handler: electoralSystemGermany2013, },
    { name: 'Germany (2021 ~ Present) (MMPR)', handler: electoralSystemGermany2021, },
];

const getElectoralSystemByIndex = (index) => (ELECTORAL_SYSTEMS[index].handler);

export const ElectoralSystem = () => {

    const TW_LEGISLATIVE_ELECTION_DATA = useMemo(() => TW_LEGISLATIVE_ELECTION_DATA_JSON, []);
    const getElectionByIndex = (index) => TW_LEGISLATIVE_ELECTION_DATA[index].data;
    const getElectoralSystemParameter = (index) => { return _.pick(TW_LEGISLATIVE_ELECTION_DATA[index], ['total_seats', 'qualified_threshold', 'total_proportional_votes']); }

    const [currentSelectedDataIndex, setCurrentSelectedDataIndex] = React.useState(0);
    const [electoralSystemParameter, setElectoralSystemParameter] = React.useState(getElectoralSystemParameter(currentSelectedDataIndex));
    const [electoralSystemIndex, setElectoralSystemIndex] = React.useState(0);
    const [data, setData] = React.useState(
        getElectoralSystemByIndex(electoralSystemIndex)(getElectionByIndex(currentSelectedDataIndex), ...Object.values(electoralSystemParameter))
    );

    const sortTypeHandler = (rowA, rowB, columnId, desc) => {
        const fn = (ascending) => (ascending ? 1 : -1);
        if (rowA.original['is_summary']) { return fn(!desc); }
        if (rowB.original['is_summary']) { return fn(desc); }
        if (rowA.original[columnId] === rowB.original[columnId]) { return 0; }
        return fn(rowA.original[columnId] > rowB.original[columnId]);
    };

    const COLUMNS = [
        {
            Header: 'Id',
            accessor: 'id',
            className: 'header-party',
            sortType: sortTypeHandler,
        },
        {
            Header: 'Party',
            accessor: 'full_name',
            className: 'header-party',
            sortType: sortTypeHandler,
        },
        {
            Header: 'Proportional Vote (%)',
            accessor: 'proportional_vote_percentage',
            className: 'header-proportionalvotepercentage',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => formatPercentage(value),
        },
        {
            Header: 'Qualified (%)',
            accessor: 'qualified_proportional_vote_percentage',
            className: 'header-proportionalvotepercentage',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => (value > 0) ? formatPercentage(value) : '-',
        },
        {
            Header: 'Constituency Seats',
            accessor: 'constituency_seats',
            className: 'header-seats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
        },
        {
            Header: 'Proportional Seats',
            accessor: 'proportional_seats',
            className: 'header-seats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
        },
        {
            Header: 'Total Seats',
            accessor: 'total_seats',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
        },
        {
            Header: 'Overhang',
            accessor: 'overhang_seats',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => (value > 0) ? "+" + value : "-",
        },
        {
            Header: 'Total Seats (%)',
            accessor: 'total_seats_percentage',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => formatPercentage(value),
        },

    ];

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    }, useSortBy);

    return (<div>
        <label>Election</label>
        <select className='electionselect' onChange={e => {
            const index = e.target.value;
            setCurrentSelectedDataIndex(index);
            const electoralSystemParameter = getElectoralSystemParameter(index);
            setElectoralSystemParameter(electoralSystemParameter);
            setData(getElectoralSystemByIndex(electoralSystemIndex)(getElectionByIndex(index), ...Object.values(electoralSystemParameter)));
        }}>
            {TW_LEGISLATIVE_ELECTION_DATA.map((obj, index) => (
                <option key={index} value={index}>
                    {obj.name}
                </option>
            ))}
        </select>
        <label>Electoral System</label>
        <select className='electoralsystemselect' onChange={e => {
            const index = e.target.value;
            setElectoralSystemIndex(index);
            setData(old => getElectoralSystemByIndex(index)(old, ...Object.values(electoralSystemParameter)));
        }}>
            {ELECTORAL_SYSTEMS.map((obj, index) => (
                <option key={index} value={index}>
                    {obj.name}
                </option>
            ))}
        </select>
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(group => (
                    <tr {...group.getHeaderGroupProps()}>
                        {group.headers.map(column => (
                            <th {...column.getHeaderProps([
                                column.getSortByToggleProps(),
                                {
                                    className: column.className,
                                    style: column.style,
                                }])}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>)
                            })}
                        </tr>
                    )
                })}
            </tbody>
            <tfoot>
                {headerGroups.map(group => (
                    <tr {...group.getHeaderGroupProps()}>
                        {group.headers.map(column => (
                            <th {...column.getHeaderProps([
                                {
                                    className: column.className,
                                    style: column.style,
                                }
                            ])}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    </div>)
};
