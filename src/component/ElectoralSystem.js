import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { tryUseConstituencyVotesInstead, electoralSystem } from './electoralSystemUtility';
import ELECTION_RESULTS_DATA_JSON from './election_results.json';
import './ElectoralSystem.css';
import _ from 'lodash';

const formatPercentage = (value) => (100 * parseFloat(value)).toFixed(2) + ' %'

const parsePercentage = (value) => parseFloat(value) / 100.0

const ELECTORAL_SYSTEMS = [
    { name: 'Taiwan (2008 - Present) (FPTP/MMM) (Hare Quota) (5%)', handler: electoralSystem.taiwan2008 },
    { name: 'Taiwan (1998 - 2007) (SNTV/MMM) (Hare Quota) (5%)', handler: electoralSystem.taiwan1998 },
    { name: 'Taiwan (1992 - 1997) (SNTV/MMM) (Hare Quota) (5%)', handler: electoralSystem.taiwan1992 },
    { name: 'Japan (1994 - Present) (FPTP/MMM) (DHondt) (2%/2)', handler: electoralSystem.japan1994 },
    { name: 'South Korea (2020 - Present) (FPTP/Hybrid) (Hare Quota) (3%/5)', handler: electoralSystem.southKorea2020 },
    { name: 'South Korea (2016 - 2019) (FPTP/MMM) (Hare Quota) (5%/5)', handler: electoralSystem.southKorea2016 },
    { name: 'South Korea (1992 - 2015) (FPTP/MMM) (Hare Quota) (3%/5)', handler: electoralSystem.southKorea1992 },
    { name: 'South Korea (1988 - 1991) (FPTP/MMM) (Hare Quota) (5)', handler: electoralSystem.southKorea1988 },
    { name: 'Germany (2021 - Present) (FPTP/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2021 },
    { name: 'Germany (2017 - 2020) (FPTP/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2017 },
    { name: 'Germany (2013 - 2016) (FPTP/MMPR+BS) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2013 },
    { name: 'Germany (2008 - 2012) (FPTP/MMPR) (Saint-Lague) (5%/3)', handler: electoralSystem.germany2008 },
    { name: 'Germany (1986 - 2007) (FPTP/MMPR) (Hare Quota) (5%/3)', handler: electoralSystem.germany1986 },
    { name: 'Germany (1949 - 1985) (FPTP/MMPR) (DHondt) (5%/3)', handler: electoralSystem.germany1949 },
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

    const ELECTION_RESULTS_DATA = useMemo(() => ELECTION_RESULTS_DATA_JSON.map(obj => tryUseConstituencyVotesInstead(obj)), []);
    const getElectionByIndex = (index) => _.cloneDeep(ELECTION_RESULTS_DATA[index].data);
    const getElectoralSystemParameter = (index) => { return _.pick(ELECTION_RESULTS_DATA[index], ['total_seats', 'total_proportional_votes']); }
    const getNewData = (selectedDataIndex, selectedElectoralSystemParameter, selectedElectoralSystemIndex, data) => {
        data = getElectoralSystemByIndex(selectedElectoralSystemIndex)(data, ...Object.values(selectedElectoralSystemParameter));
        return {
            data,
            constituency_seats: data.find(obj => obj.is_summary).constituency_seats,
            proportional_seats: data.find(obj => obj.is_summary).proportional_seats,
            original_total_seats: selectedElectoralSystemParameter.total_seats,
            total_seats: data.find(obj => obj.is_summary).total_seats,
            overhang_seats: data.find(obj => obj.is_summary).overhang_seats,
        }
    }

    const [state, setState] = React.useState(() => {
        const selectedDataIndex = 0;
        const selectedElectoralSystemParameter = getElectoralSystemParameter(selectedDataIndex);
        const selectedElectoralSystemIndex = 0;
        const inputTotalSeats = selectedElectoralSystemParameter.total_seats;
        return {
            selectedDataIndex,
            selectedElectoralSystemParameter,
            selectedElectoralSystemIndex,
            inputTotalSeats,
            ...getNewData(selectedDataIndex, selectedElectoralSystemParameter, selectedElectoralSystemIndex, getElectionByIndex(selectedDataIndex))
        }
    });

    const modifyData = (rowIndex, columnId, value) => {
        setState(old => {
            const newData = old.data.map((row, index) => {
                if (index === rowIndex) {
                    if (columnId === 'proportional_vote_percentage') {
                        columnId = 'proportional_votes';
                        value *= Math.round(old.selectedElectoralSystemParameter.total_proportional_votes);
                    }
                    return {
                        ...old.data[rowIndex],
                        [columnId]: value,
                    }
                }
                return row;
            });
            return {
                ...old,
                ...getNewData(old.selectedDataIndex, old.selectedElectoralSystemParameter, old.selectedElectoralSystemIndex, _.cloneDeep(newData))
            };
        })
    }

    const PercentageEditableCell = ({
        value: initialValue,
        row: { index },
        column: { id },
    }) => {
        const [value, setValue] = React.useState(formatPercentage(initialValue))
        const onChange = e => { setValue(e.target.value) }
        const onBlur = () => {
            const roundingValue = parsePercentage(value);
            if (roundingValue !== parsePercentage(formatPercentage(initialValue))) {
                modifyData(index, id, parsePercentage(value))
            }
        }
        React.useEffect(() => { setValue(formatPercentage(initialValue)) }, [initialValue])
        return <input className='editablecell' value={value} onChange={onChange} onBlur={onBlur} />
    }

    const NumberEditableCell = ({
        value: initialValue,
        row: { index },
        column: { id },
    }) => {
        const [value, setValue] = React.useState(initialValue)
        const onChange = e => { setValue(e.target.value) }
        const onBlur = () => { modifyData(index, id, parseInt(value)) }
        React.useEffect(() => { setValue(initialValue) }, [initialValue])
        return <input className='editablecell' value={value} onChange={onChange} onBlur={onBlur} />
    }

    const COLUMNS = [
        {
            Header: 'Id',
            accessor: 'id',
            className: 'header-id',
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{value}</div>,
        },
        {
            Header: 'Party',
            accessor: 'name',
            className: 'header-party',
            sortType: sortTypeHandler,
            Cell: ({ value, row }) => (<div className='textonlycell'><img src={row.original.icon} alt='' /><span>{value}</span></div>),
        },
        {
            Header: 'Vote (%)',
            accessor: 'proportional_vote_percentage',
            className: 'header-proportionalvotepercentage',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: PercentageEditableCell,
        },
        {
            Header: 'Qualified (%)',
            accessor: 'qualified_proportional_vote_percentage',
            className: 'header-proportionalvotepercentage',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{(value > 0) ? formatPercentage(value) : '-'}</div>,
        },
        {
            Header: 'Constituency',
            accessor: 'constituency_seats',
            className: 'header-constituencyseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: NumberEditableCell,
        },
        {
            Header: 'Proportional',
            accessor: 'proportional_seats',
            className: 'header-proportionalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{value}</div>,
        },
        {
            Header: 'Total',
            accessor: 'total_seats',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{value}</div>,
        },

        {
            Header: 'Total (%)',
            accessor: 'total_seats_percentage',
            className: 'header-totalseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{formatPercentage(value)}</div>,
        },
        {
            Header: 'Overhang',
            accessor: 'overhang_seats',
            className: 'header-overhangseats',
            sortDescFirst: true,
            sortType: sortTypeHandler,
            Cell: ({ value }) => <div className='textonlycell'>{(value > 0) ? "+" + value : "-"}</div>,
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
        initialState: { hiddenColumns: ['id'] },
        data: state.data,
    }, useSortBy);

    return (<div className='outter'>
        <div>
            <label>Election</label>
            <select className='electionselect' onChange={e => {
                setState(old => {
                    const selectedDataIndex = e.target.value;
                    const selectedElectoralSystemParameter = getElectoralSystemParameter(selectedDataIndex);
                    return {
                        ...old,
                        selectedDataIndex,
                        selectedElectoralSystemParameter,
                        inputTotalSeats: selectedElectoralSystemParameter.total_seats,
                        ...getNewData(selectedDataIndex, getElectoralSystemParameter(selectedDataIndex), old.selectedElectoralSystemIndex, getElectionByIndex(selectedDataIndex))
                    }
                });
            }}>
                {ELECTION_RESULTS_DATA.map((obj, index) => (
                    <option key={index} value={index}>
                        {obj.name}
                    </option>
                ))}
            </select>
            <label>Seats</label>
            <input className='electionseatsinput' value={state.inputTotalSeats}
                onChange={e => { setState(old => { return { ...old, inputTotalSeats: e.target.value } }) }}
                onBlur={() => {
                    let inputTotalSeats = parseInt(state.inputTotalSeats);
                    inputTotalSeats = Math.max(isNaN(inputTotalSeats) ? 0 : inputTotalSeats, state.constituency_seats);
                    setState(old => {
                        const selectedElectoralSystemParameter = { ...old.selectedElectoralSystemParameter, total_seats: inputTotalSeats };
                        return {
                            ...old,
                            selectedElectoralSystemParameter,
                            inputTotalSeats,
                            ...getNewData(old.selectedDataIndex, selectedElectoralSystemParameter, old.selectedElectoralSystemIndex, _.cloneDeep(old.data))
                        };
                    })
                }} />
        </div>
        <div>
            <label>Electoral System</label>
            <select className='electoralsystemselect' onChange={e => {
                setState(old => {
                    const selectedElectoralSystemIndex = e.target.value;
                    return {
                        ...old,
                        selectedElectoralSystemIndex,
                        ...getNewData(old.selectedDataIndex, old.selectedElectoralSystemParameter, selectedElectoralSystemIndex, _.cloneDeep(old.data))
                    };
                })
            }}>
                {ELECTORAL_SYSTEMS.map((obj, index) => (
                    <option key={index} value={index}>
                        {obj.name}
                    </option>
                ))}
            </select>
        </div>
        <div className='progressbartop'>
            <ProgressBar>
                <ProgressBar variant="constituencyseats" label={state.constituency_seats} now={state.constituency_seats} min={0} max={state.total_seats} />
                <ProgressBar variant="proportionalseats" label={state.proportional_seats} now={state.proportional_seats} min={0} max={state.total_seats} />
            </ProgressBar>
        </div>
        <div className='progressbarmiddle'>
            <ProgressBar>
                <ProgressBar variant="originalseats" label={state.original_total_seats} now={state.original_total_seats} min={0} max={state.total_seats} />
                <ProgressBar variant="overhangseats" label={state.overhang_seats} now={state.overhang_seats} min={0} max={state.total_seats} />
            </ProgressBar>
        </div>
        <div className='progressbarbottom'>
            <ProgressBar variant="totalseats" label={state.total_seats} now={state.total_seats} min={0} max={state.total_seats} />
        </div>
        <div className='tablewrap'>
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
        </div>
    </div >)
};
