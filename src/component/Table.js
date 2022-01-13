import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import './Table.css';


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
        Cell: ({ value }) => { return (100 * value).toFixed(2) + " %"; },
    },
    {
        Header: 'Qualified Proportional Vote (%)',
        accessor: 'qualified_proportional_vote_percentage',
        sortDescFirst: true,
        sortType: 'number',
        Cell: ({ value }) => { return (100 * value).toFixed(2) + " %"; },
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
        Cell: ({ value }) => { return (100 * value).toFixed(2) + " %"; },
    },
];

export const Table = ({ data, updateData }) => {

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

    return (
        <div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
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
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    )
};
