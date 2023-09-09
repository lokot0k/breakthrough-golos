import _ from "lodash";
import { Bar } from "react-chartjs-2";
import {ChartData} from "chart.js";
// @ts-ignore
export function HorizontalChart({height, width, words}) {
    const sortedWords = _.sortBy(words, (w) => w.value);
    _.reverse(sortedWords);
    const data: ChartData = {
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
    return <Bar data={data} options={{
        indexAxis: 'y',
        plugins:{
            legend: {display: false},
            title: {
                display: true,
                text: 'График ответов'
            }
        }}}> </Bar>

}