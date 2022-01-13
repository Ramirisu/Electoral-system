import React, { useMemo } from 'react';
import { COLUMNS } from './column';
import { Table } from "./Table";
import TW2020 from './tw2020.json';

export const ElectionMethod = () => {
    const columns = useMemo(() => COLUMNS, []);
    const [data, setData] = React.useState(useMemo(() => TW2020, []));

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
    }

    return (<div>
        <Table
            columns={columns}
            data={data}
            updateData={updateData}
        />
    </div>)
};
