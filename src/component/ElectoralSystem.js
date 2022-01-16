import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { electoralSystem } from './electoralSystemUtility';
import TW_LEGISLATIVE_ELECTION_DATA_JSON from './election_results.json';
import './ElectoralSystem.css';
import _ from 'lodash';

const formatPercentage = (value) => {
    return (100 * parseFloat(value)).toFixed(2) + ' %';
}

const ELECTORAL_SYSTEMS = [
    { name: 'Taiwan (2008 ~ Present) (MMM) (Hare Quota)', handler: electoralSystem.taiwan2008 },
    { name: 'Japan (1994 ~ Present) (MMM) (DHondt)', handler: electoralSystem.japan1994 },
    { name: 'South Korea (2004 ~ 2019) (MMM) (Hare Quota)', handler: electoralSystem.southKorea2004 },
    { name: 'Germany (1949 ~ 2008) (MMPR) (Hare Quota)', handler: electoralSystem.germany1949 },
    { name: 'Germany (2009 ~ 2012) (MMPR) (Saint-Lague)', handler: electoralSystem.germany2009 },
    { name: 'Germany (2013 ~ 2020) (MMPR) (Saint-Lague)', handler: electoralSystem.germany2013 },
    { name: 'Germany (2021 ~ Present) (MMPR) (Saint-Lague)', handler: electoralSystem.germany2021 },
];

const getElectoralSystemByIndex = (index) => (ELECTORAL_SYSTEMS[index].handler);

export const ElectoralSystem = () => {

    const TW_LEGISLATIVE_ELECTION_DATA = useMemo(() => TW_LEGISLATIVE_ELECTION_DATA_JSON, []);
    const getElectionByIndex = (index) => TW_LEGISLATIVE_ELECTION_DATA[index].data;
    const getElectoralSystemParameter = (index) => { return _.pick(TW_LEGISLATIVE_ELECTION_DATA[index], ['total_seats', 'qualified_threshold', 'total_proportional_votes']); }

    const [state, setState] = React.useState(() => {
        const selectedDataIndex = 0;
        const selectedElectoralSystemParameter = getElectoralSystemParameter(selectedDataIndex);
        const selectedElectoralSystemIndex = 0;
        return {
            selectedDataIndex,
            selectedElectoralSystemParameter,
            selectedElectoralSystemIndex,
            data: getElectoralSystemByIndex(selectedElectoralSystemIndex)(getElectionByIndex(selectedDataIndex), ...Object.values(selectedElectoralSystemParameter)),
        };
    });

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
            accessor: 'name',
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
        data: state.data,
    }, useSortBy);

    return (<div>
        <label>Election</label>
        <select className='electionselect' onChange={e => {
            const index = e.target.value;
            setState(old => {
                const selectedDataIndex = index;
                const selectedElectoralSystemParameter = getElectoralSystemParameter(selectedDataIndex);
                return {
                    selectedDataIndex,
                    selectedElectoralSystemParameter,
                    selectedElectoralSystemIndex: old.selectedElectoralSystemIndex,
                    data: getElectoralSystemByIndex(old.selectedElectoralSystemIndex)(getElectionByIndex(selectedDataIndex), ...Object.values(selectedElectoralSystemParameter)),
                };
            });
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
            setState(old => {
                const selectedElectoralSystemIndex = index;
                return {
                    selectedDataIndex: old.selectedDataIndex,
                    selectedElectoralSystemParameter: old.selectedElectoralSystemParameter,
                    selectedElectoralSystemIndex,
                    data: getElectoralSystemByIndex(selectedElectoralSystemIndex)(getElectionByIndex(old.selectedDataIndex), ...Object.values(old.selectedElectoralSystemParameter)),
                };
            })
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
