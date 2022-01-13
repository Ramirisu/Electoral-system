import React from 'react';
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
        updateData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

const defaultColumn = {
    Cell: EditableCell,
};

export const Table = ({ columns, data, updateData }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        defaultColumn,
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
