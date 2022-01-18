import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { electoralSystem } from './electoralSystemUtility';
import ELECTION_RESULTS_DATA_JSON from './election_results.json';
import './ElectoralSystem.css';
import _ from 'lodash';

const formatPercentage = (value) => (100 * parseFloat(value)).toFixed(2) + ' %'

const ELECTORAL_SYSTEMS = [
    { name: 'Taiwan (2008 ~ Present) (SMD/MMM) (Hare Quota) (5%)', handler: electoralSystem.taiwan2008 },
    { name: 'Japan (1994 ~ Present) (SMD/MMM) (DHondt) (2%/2)', handler: electoralSystem.japan1994 },
    { name: 'South Korea (1988 ~ 1991) (SMD/MMM) (Hare Quota) (5)', handler: electoralSystem.southKorea1988 },
    { name: 'South Korea (1992 ~ 2015) (SMD/MMM) (Hare Quota) (3%/5)', handler: electoralSystem.southKorea1992 },
    { name: 'South Korea (2016 ~ 2019) (SMD/MMM) (Hare Quota) (5%/5)', handler: electoralSystem.southKorea2016 },
    { name: 'Germany (1949 ~ 1985) (SMD/MMPR) (DHondt) (5%/3)', handler: electoralSystem.germany1949 },
    { name: 'Germany (1986 ~ 2007) (SMD/MMPR) (Hare Quota) (5%/3)', handler: electoralSystem.germany1986 },
    { name: 'Germany (2008 ~ 2012) (SMD/MMPR) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2008 },
    { name: 'Germany (2013 ~ 2016) (SMD/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2013 },
    { name: 'Germany (2017 ~ 2020) (SMD/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2017 },
    { name: 'Germany (2021 ~ Present) (SMD/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2021 },
];

const getElectoralSystemByIndex = (index) => (ELECTORAL_SYSTEMS[index].handler);

const sortTypeHandler = (rowA, rowB, columnId, desc) => {
    const fn = (ascending) => (ascending ? 1 : -1);
    if (rowA.original['is_summary']) { return fn(!desc); }
    if (rowB.original['is_summary']) { return fn(desc); }
    if (rowA.original[columnId] === rowB.original[columnId]) { return 0; }
    return fn(rowA.original[columnId] > rowB.original[columnId]);
};

export const ElectoralSystem = () => {

    const ELECTION_RESULTS_DATA = useMemo(() => ELECTION_RESULTS_DATA_JSON, []);
    const getElectionByIndex = (index) => _.cloneDeep(ELECTION_RESULTS_DATA[index].data);
    const getElectoralSystemParameter = (index) => { return _.pick(ELECTION_RESULTS_DATA[index], ['total_seats', 'total_proportional_votes', 'total_constituency_votes']); }
    const getNewData = (selectedDataIndex, selectedElectoralSystemParameter, selectedElectoralSystemIndex, data) => {
        return {
            selectedDataIndex,
            selectedElectoralSystemParameter,
            selectedElectoralSystemIndex,
            data: getElectoralSystemByIndex(selectedElectoralSystemIndex)(data, ...Object.values(selectedElectoralSystemParameter)),
        }
    }

    const [state, setState] = React.useState(() => {
        const selectedDataIndex = 0;
        const selectedElectoralSystemIndex = 0;
        return getNewData(selectedDataIndex, getElectoralSystemParameter(selectedDataIndex), selectedElectoralSystemIndex, getElectionByIndex(selectedDataIndex))
    });

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
            Cell: ({ value, row }) => (<div><img src={row.original.icon} alt='' /><span>{value}</span></div>),

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
            Header: 'Total Seats (%)',
            accessor: 'total_seats_percentage',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => formatPercentage(value),
        },
        {
            Header: 'Overhang',
            accessor: 'overhang_seats',
            className: 'header-overhangseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => (value > 0) ? "+" + value : "-",
        },

    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setState(old => {
                const selectedDataIndex = e.target.value;
                return getNewData(selectedDataIndex, getElectoralSystemParameter(selectedDataIndex), old.selectedElectoralSystemIndex, getElectionByIndex(selectedDataIndex))
            });
        }}>
            {ELECTION_RESULTS_DATA.map((obj, index) => (
                <option key={index} value={index}>
                    {obj.name}
                </option>
            ))}
        </select>
        <label>Electoral System</label>
        <select className='electoralsystemselect' onChange={e => {
            setState(old => {
                const selectedElectoralSystemIndex = e.target.value;
                return getNewData(old.selectedDataIndex, old.selectedElectoralSystemParameter, selectedElectoralSystemIndex, _.cloneDeep(old.data));
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
