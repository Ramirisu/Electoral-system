import React, { useMemo } from 'react';
import { electionModelTaiwan2008, electionModelGermany } from './electionModel';
import { Table } from "./Table";
import TW2020 from './tw2020.json';


const ELECTION_MODELS = [
    {
        name: 'Taiwan (2008 Version)',
        handler: electionModelTaiwan2008
    },
    {
        name: 'Germany',
        handler: electionModelGermany
    },
];

export const ElectionMethod = () => {

    const TOTAL_SEATS = 113;
    const QUALIFIED_THREASHOLD = 0.05;

    const [electionModelIndex, setElectionModelIndex] = React.useState(0);
    const [data, setData] = React.useState(ELECTION_MODELS[electionModelIndex].handler(useMemo(() => TW2020, []), TOTAL_SEATS, QUALIFIED_THREASHOLD));

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
        setData(old => ELECTION_MODELS[electionModelIndex].handler(old, TOTAL_SEATS, QUALIFIED_THREASHOLD));
    }

    return (<div>
        <select onChange={e => {
            const index = e.target.value;
            setElectionModelIndex(index);
            setData(old => ELECTION_MODELS[index].handler(old, TOTAL_SEATS, QUALIFIED_THREASHOLD));
        }}>
            {ELECTION_MODELS.map((obj, index) => (
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
