import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import TW2020 from './tw2020.json';
import { COLUMNS } from './column';
import './Table.css';

export const Table = () => {

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => TW2020, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
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
