import {LabeledAnswer} from "./Test";
import _, {sortBy} from "lodash";
import {Sentiments} from "./utils";

type Cluster = [string, string[], Sentiments];

function DropdownElement({ cluster }: { cluster: Cluster }) {
    return <div className={`DropdownElement${cluster[1].length == 1 ? " solo" : ""}`}>
        <div className={`dropdown-label ${cluster[2]}`}>
            {`${cluster[0]}${cluster[1].length > 1 ? ` (x${cluster[1].length})` : ''}`}
        </div>
        <div className="dropdown-content">
            <ul>
                {cluster[1].map((value, i) => <li key={i}><div>{value}</div></li>)}
            </ul>
        </div>
    </div>
}

function DropdownColumn({ clusters }: { clusters: Cluster[] }) {
    return <div className="DropdownColumn">
        {clusters.map((value, i) => <DropdownElement key={i} cluster={value}/>)}
    </div>
}


export function Dropdown({ data } : { data: _.Dictionary<LabeledAnswer[]> }) {
    const clusters: Cluster[] = Object.entries(data).map(value =>
        [value[0], value[1].map(v => v.corrected || v.answer), value[1][0].sentiment])

    let columns = [0, 1, 2].map(c => sortBy(clusters, value => -value[1].length).filter((_, i) => i % 3 === c));
    return <div className="Dropdown">
        <ul>
            {columns.map((value, i) => <li key={i}><DropdownColumn clusters={value} /></li>)}
        </ul>
    </div>
}