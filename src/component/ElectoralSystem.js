import React, { useMemo } from 'react';
import { electoralSystemGermany1949, electoralSystemTaiwan2008, } from './electoralSystemUtility';
import { Table } from "./Table";
import TW2020 from './tw2020.json';
import './ElectoralSystem.css';


const ELECTORAL_SYSTEMS = [
    {
        name: 'Taiwan (2008) (MMM)',
        handler: electoralSystemTaiwan2008
    },
    {
        name: 'Germany (1949) (MMPR)',
        handler: electoralSystemGermany1949
    },
];

const getElectoralSystemByIndex = (index) => {
    return ELECTORAL_SYSTEMS[index].handler;
}

export const ElectoralSystem = () => {

    const TOTAL_SEATS = 113;
    const QUALIFIED_THRESHOLD = 0.05;

    const [electoralSystemIndex, setElectoralSystemIndex] = React.useState(0);
    const initialData = getElectoralSystemByIndex(electoralSystemIndex)(useMemo(() => TW2020, []), TOTAL_SEATS, QUALIFIED_THRESHOLD);
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
        setData(old => getElectoralSystemByIndex(electoralSystemIndex)(old, TOTAL_SEATS, QUALIFIED_THRESHOLD));
    }

    return (<div>
        <label>Electoral System</label>
        <select onChange={e => {
            const index = e.target.value;
            setElectoralSystemIndex(index);
            setData(old => getElectoralSystemByIndex(index)(old, TOTAL_SEATS, QUALIFIED_THRESHOLD));
        }}>
            {ELECTORAL_SYSTEMS.map((obj, index) => (
                <option key={index} value={index}>
                    {obj.name}
                </option>
            ))}
        </select>
        <Table
            data={data}
            updateData={updateData}
        />
    </div>)
};
