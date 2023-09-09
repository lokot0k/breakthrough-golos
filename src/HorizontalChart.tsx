import _, {sumBy} from "lodash";
import {Bar} from "react-chartjs-2";
import {ChartData} from "chart.js";
import {LabeledAnswer} from "./Test";

export function HorizontalChart({height, width, data}: { height: number, width: number, data: _.Dictionary<LabeledAnswer[]> }) {
    const words = Object.entries(data).map(([cluster, answers]) =>
        ({
            text: cluster,
            value: sumBy(answers, value => value.count),
            // @ts-ignore
            sentiment: (answers[0].sentiment === 'positives' || answers[0].sentiment === 'neutrals' || answers[0].sentiment === 'negatives') ? answers[0].sentiment : "neutrals",
        })
    )

    const sortedWords = _.sortBy(words, (w) => w.value);
    _.reverse(sortedWords);
    const chartData: ChartData = {
        labels: sortedWords.map((w) => w.text),
        datasets: [
            {
                label: "Quanity of votes",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: sortedWords.map((w) => w.value)
            }
        ]
    }
    const config = {
        type: 'horizontalBar',
        data: {
            labels: sortedWords.map((w) => w.text),
            datasets: [
                {
                    label: "Quanity of votes",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: sortedWords.map((w) => w.value)
                }
            ]
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: 'График ответов'
            }
        }
    }
    // @ts-ignore
    return <Bar data={chartData} options={{
        indexAxis: 'y',
        plugins: {
            legend: {display: false},
            title: {
                display: true,
                text: 'График ответов'
            }
        }
    }}> </Bar>

}