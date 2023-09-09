import {LabeledAnswer} from "./Test";
import _, {sortBy} from "lodash";

function DropdownElement({ cluster }: { cluster: [string, string[]] }) {
    return <div className="DropdownElement">
        <div className="dropdown-label">
            {`${cluster[0]}${cluster[1].length > 1 ? ` (x${cluster[1].length})` : ''}`}
        </div>
        <div className="dropdown-content">
            <ul>
                {cluster[1].map((value, i) => <li key={i}><div>{value}</div></li>)}
            </ul>
        </div>
    </div>
}

function DropdownColumn({ clusters }: { clusters: [string, string[]][] }) {
    return <div className="DropdownColumn">
        {clusters.map((value, i) => <DropdownElement key={i} cluster={value}/>)}
    </div>
}

export function Dropdown({ data } : { data: _.Dictionary<LabeledAnswer[]> }) {
    const clusters = Object.fromEntries(Object.entries(data).map(value => [value[0], value[1].map(v => v.corrected || v.answer)]))

    let columns = [0, 1, 2].map(c => sortBy(Object.entries(clusters), value => -value[1].length).filter((_, i) => i % 3 === c));
    return <div className="Dropdown">
        <ul>
            {columns.map((value, i) => <li key={i}><DropdownColumn clusters={value} /></li>)}
        </ul>
    </div>
}