import React, { useMemo } from 'react';
import { electionModelTaiwan2008, electionModelGermany } from './electionModel';
import { Table } from "./Table";
import TW2020 from './tw2020.json';

export const ElectionMethod = () => {

    const TOTAL_SEATS = 113;
    const QUALIFIED_THREASHOLD = 0.05;

    const electionModelFunc = electionModelTaiwan2008;

    const initialData = useMemo(() => TW2020, []);
    electionModelFunc(initialData, TOTAL_SEATS, QUALIFIED_THREASHOLD);
    const [data, setData] = React.useState(initialData);


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
        setData(old => electionModelFunc(old, TOTAL_SEATS, QUALIFIED_THREASHOLD));
    }

    return (<div>
        <Table
            data={data}
            updateData={updateData}
        />
    </div>)
};
