import {Wordcloud} from "@visx/wordcloud";
import {Text} from "@visx/text";
import {ChangeEventHandler, useState} from "react";
import {scaleLog} from "@visx/scale";
import _, {sumBy} from "lodash";


interface WordData {
    text: string;
    value: number;
}

interface LabeledAnswer {
    answer: string
    cluster: string
    corrected: string | null | undefined
    count: number
    sentiment: ["positives", "neutrals", "negatives"]
}

interface LabeledData {
    question: string
    id: number
    answers: LabeledAnswer[]
}

export function CustomWordCloud({height, width, data}: { height: number, width: number, data: _.Dictionary<LabeledAnswer[]> }) {
    const words = Object.entries(data).map(([cluster, answers]) =>
        ({
            text: cluster,
            value: sumBy(answers, value => value.count),
            // @ts-ignore
            sentiment: (answers[0].sentiment === 'positives' || answers[0].sentiment === 'neutrals' || answers[0].sentiment === 'negatives') ? answers[0].sentiment : "neutrals",
        })
    )

    const fontScale = scaleLog({
        // domain: [Math.min(...words.map((w: { value: any; }) => w.value)), Math.max(...words.map((w: { value: any; }) => w.value))],
        range: [35, 100],
    });
    const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

    const positive_colors = ['#FFB140', '#FFC879', '#FFDFB0']
    const neutrals_colors = ['#CBD2DB']
    const negatives_colors = ['#69353F', '#9F6D77', '#D2ADB4']
    const color_dict: any = {};
    color_dict['positives'] = positive_colors;
    color_dict['neutrals'] = neutrals_colors;
    color_dict['negatives'] = negatives_colors;
    console.log(words)
    return <Wordcloud width={width} height={height} words={words}
                      fontSize={fontSizeSetter}
                      font={"Inter"}
                      rotate={0}
                      spiral="archimedean"
                      padding={2}
                      random={() => 0.5}>
        {(cloudWords) => cloudWords.map((w, i) => {
                // console.log(w)
                return <Text key={w.text} textAnchor={'middle'}
                             transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                    // @ts-ignore
                             fill={color_dict[(words[i]?.sentiment || 'neutrals')][i % (color_dict[(words[i]?.sentiment || 'neutrals')].length) || 0]}
                             fontSize={w.size} fontFamily={w.font}>{w.text}</Text>
            }
        )}
    </Wordcloud>
}