import React, { useMemo } from 'react';
import { electoralSystemGermany1949, electoralSystemGermany2017, electoralSystemTaiwan2008, } from './electoralSystemUtility';
import { Table } from "./Table";
import TW_LEGISLATIVE_ELECTION_DATA_JSON from './taiwan_legislative_election.json';
import './ElectoralSystem.css';



const ELECTORAL_SYSTEMS = [
    {
        name: 'Taiwan (2008 ~ Present) (MMM)',
        handler: electoralSystemTaiwan2008,
    },
    {
        name: 'Germany (1949 ~ 2016) (MMPR)',
        handler: electoralSystemGermany1949,
    },
    {
        name: 'Germany (2017 ~ Present) (MMPR)',
        handler: electoralSystemGermany2017,
    },
];

const getElectoralSystemByIndex = (index) => {
    return ELECTORAL_SYSTEMS[index].handler;
}

export const ElectoralSystem = () => {

    const TW_LEGISLATIVE_ELECTION_DATA = useMemo(() => TW_LEGISLATIVE_ELECTION_DATA_JSON, []);
    const getElectoralSystemParameter = (index) => {
        return {
            total_seats: TW_LEGISLATIVE_ELECTION_DATA[index].total_seats,
            qualified_threshold: TW_LEGISLATIVE_ELECTION_DATA[index].qualified_threshold,
        };
    }

    const [currentSelectedDataIndex, setCurrentSelectedIndex] = React.useState(1);
    const [electoralSystemParameter, setElectoralSystemParameter] = React.useState(getElectoralSystemParameter(currentSelectedDataIndex));
    const [electoralSystemIndex, setElectoralSystemIndex] = React.useState(0);
    const [data, setData] = React.useState(
        getElectoralSystemByIndex(electoralSystemIndex)(TW_LEGISLATIVE_ELECTION_DATA[currentSelectedDataIndex].data, ...Object.values(electoralSystemParameter))
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

    return (<div>
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
        <Table
            data={data}
            updateData={updateData}
        />
    </div>)
};
