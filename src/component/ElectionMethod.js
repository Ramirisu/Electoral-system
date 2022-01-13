import React, { useMemo } from 'react';
import { electionModelTaiwan2008 } from './electionModel';
import { Table } from "./Table";
import TW2020 from './tw2020.json';

export const ElectionMethod = () => {

    const PROPORTIONAL_SEATS = 34;
    const QUALIFIED_THREASHOLD = 0.05;

    const initialData = useMemo(() => TW2020, []);
    electionModelTaiwan2008(initialData, PROPORTIONAL_SEATS, QUALIFIED_THREASHOLD);
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
        setData(old => electionModelTaiwan2008(old, PROPORTIONAL_SEATS, QUALIFIED_THREASHOLD));
    }

    return (<div>
        <Table
            data={data}
            updateData={updateData}
        />
    </div>)
};
