import {ChartData} from "chart.js";
import {Doughnut} from "react-chartjs-2";
import _ from "lodash";
import {Sentiments} from "./utils";

export function DonughtStat({results}: { results: any }) {
    console.log("result")
    console.log(results)
    const stats = _.countBy(results, (x)=> x[0].sentiment)
    console.log(stats)
    const data: ChartData<"doughnut"> = {
        labels: ['Негативные', 'Нейтральные', 'Позитивные'],
        datasets: [
            {
                label: 'Опрос',
                data: [stats['negatives'], stats['neutrals'], stats['positives']],
                backgroundColor: ["#69353F", "#788AA3", "#FFB140"],
            }
        ]
    }

    return <div className="Chart">

        <div style={{
            width: "60%",
            height: "60%"
        }}>
            <Doughnut data={data} options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Распределение голосов по настроению'
                    }
                }
            }}/>
        </div>
    </div>;
}