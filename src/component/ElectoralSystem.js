import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { electoralSystemGermany1949, electoralSystemGermany2013, electoralSystemTaiwan2008, } from './electoralSystemUtility';
import TW_LEGISLATIVE_ELECTION_DATA_JSON from './election_results.json';
import './ElectoralSystem.css';

const formatPercentage = (value) => {
    return (100 * parseFloat(value)).toFixed(2) + ' %';
}

const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateData,
}) => {
    const [value, setValue] = React.useState(initialValue);

    const onChange = e => {
        setValue(e.target.value)
    }

    const onBlur = () => {
        updateData(index, id, parseFloat(value))
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input className='editable-cell' value={value} onChange={onChange} onBlur={onBlur} />;
};

const ELECTORAL_SYSTEMS = [
    {
        name: 'Taiwan (2008 ~ Present) (MMM)',
        handler: electoralSystemTaiwan2008,
    },
    {
        name: 'Germany (1949 ~ 2012) (MMPR)',
        handler: electoralSystemGermany1949,
    },
    {
        name: 'Germany (2013 ~ Present) (MMPR)',
        handler: electoralSystemGermany2013,
    },
];

const getElectoralSystemByIndex = (index) => {
    return ELECTORAL_SYSTEMS[index].handler;
}

export const ElectoralSystem = () => {

    const TW_LEGISLATIVE_ELECTION_DATA = useMemo(() => TW_LEGISLATIVE_ELECTION_DATA_JSON, []);
    const getElectionByIndex = (index) => TW_LEGISLATIVE_ELECTION_DATA[index].data;
    const getElectoralSystemParameter = (index) => {
        return {
            total_seats: TW_LEGISLATIVE_ELECTION_DATA[index].total_seats,
            qualified_threshold: TW_LEGISLATIVE_ELECTION_DATA[index].qualified_threshold,
            total_proportional_votes: TW_LEGISLATIVE_ELECTION_DATA[index].total_proportional_votes,
        };
    }

    const [currentSelectedDataIndex, setCurrentSelectedDataIndex] = React.useState(0);
    const [electoralSystemParameter, setElectoralSystemParameter] = React.useState(getElectoralSystemParameter(currentSelectedDataIndex));
    const [electoralSystemIndex, setElectoralSystemIndex] = React.useState(0);
    const [data, setData] = React.useState(
        getElectoralSystemByIndex(electoralSystemIndex)(getElectionByIndex(currentSelectedDataIndex), ...Object.values(electoralSystemParameter))
    );

    const updateData = (rowIndex, columnId, value) => {
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
        setData(old => getElectoralSystemByIndex(electoralSystemIndex)(old, ...Object.values(electoralSystemParameter)));
    }

    const COLUMNS = [
        {
            Header: 'Id',
            accessor: 'id',
            sortDescFirst: true,
            sortType: 'number',
        },
        {
            Header: 'Party',
            accessor: 'full_name',
        },
        {
            Header: 'Proportional Vote (%)',
            accessor: 'proportional_vote_percentage',
            sortDescFirst: true,
            sortType: 'number',
            Cell: ({ value }) => formatPercentage(value),
        },
        {
            Header: 'Qualified Proportional Vote (%)',
            accessor: 'qualified_proportional_vote_percentage',
            sortDescFirst: true,
            sortType: 'number',
            Cell: ({ value }) => formatPercentage(value),
        },
        {
            Header: 'Proportional Seats',
            accessor: 'proportional_seats',
            sortDescFirst: true,
            sortType: 'number',
        },
        {
            Header: 'Constituency Seats',
            accessor: 'constituency_seats',
            sortDescFirst: true,
            sortType: 'number',
        },
        {
            Header: 'Total Seats',
            accessor: 'total_seats',
            sortDescFirst: true,
            sortType: 'number',
        },
        {
            Header: 'Overhang Seats',
            accessor: 'overhang_seats',
            sortDescFirst: true,
            sortType: 'number',
            Cell: ({ value }) => {
                if (value > 0) { return "+" + value; }
                return "-";
            }
        },
        {
            Header: 'Total Seats %',
            accessor: 'total_seats_percentage',
            sortDescFirst: true,
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
        updateData,
    }, useSortBy);

    return (<div>
        <label>Election</label>
        <select onChange={e => {
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
        <select onChange={e => {
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
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
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
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    </div>)
};
