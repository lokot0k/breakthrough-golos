import {Doughnut} from "react-chartjs-2";
import {ChartData} from "chart.js";

export function Chart({results}: { results: string[] }) {

    const data: ChartData<"doughnut"> = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [3, 17, 4, 5, 6],
                // backgroundColor: ["red", "orange", "yellow", "green", "blue"],
            }
        ]
    }

    return <div className="Chart">
        <ul>
            {results.map((value, index) => <li key={index}>{value}</li>)}
        </ul>
        <div style={{
            height: 256,
            width: 256
        }}>
            <Doughnut data={data} options={{
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }}/>
        </div>
    </div>;
}