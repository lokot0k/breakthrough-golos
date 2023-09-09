import {Params, useLoaderData} from "react-router-dom";
import QRCode from "react-qr-code";
import {Chart} from "./Chart";
import {Form} from "react-bootstrap"
import {ChangeEventHandler, useState} from "react";
import _, {sortBy, sumBy, words} from "lodash";
import {Wordcloud} from "@visx/wordcloud";
import {Text} from "@visx/text"
import {scaleLog} from "@visx/scale";

interface WordData {
    text: string;
    value: number;
}

interface AdminQuestion {
    id: string
    text: string
    url: string
}

async function getQuestion(pollId: string): Promise<AdminQuestion> {
    return {
        id: pollId,
        text: `Question №${pollId}`,
        url: `https://192.168.0.220:3000/poll/${pollId}`
    }
}

export async function loader({params}: { params: Params }) {
    const question = await getQuestion(params.pollId!)
    return {question}
}

interface LabeledData {
    question: string
    id: number
    answers: LabeledAnswer[]
}

interface LabeledAnswer {
    answer: string
    cluster: string
    corrected: string | null | undefined
    count: number
    sentiment: ["positives", "neutrals", "negatives"]
}

export function Test() {
    const [data, setData] = useState({} as _.Dictionary<LabeledAnswer[]>);
    const [words, setWords] = useState([] as WordData[]);

    const fontScale = scaleLog({
        domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
        range: [10, 100],
    });
    const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

    const handleFile: ChangeEventHandler<HTMLInputElement> = async event => {
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            const text = await file.text();
            const data: LabeledData = JSON.parse(text)
            const clusters = _.groupBy(data.answers, 'cluster')
            console.log(clusters)
            setData(clusters)

            setWords(Object.entries(clusters).map(([cluster, answers]) =>
                ({
                    text: cluster,
                    value: sumBy(answers, value => value.count) * 1000
                })
            ))
        }
    }

    const {question} = useLoaderData() as { question: AdminQuestion }
    return <div className="AdminPoll">
        <div className="chart-section">
            {!_.isEmpty(data) ? (
                <Wordcloud width={1024} height={512} words={words}
                           fontSize={fontSizeSetter}
                           font={"Inter"}
                           rotate={0}
                           spiral="archimedean"
                           padding={2}
                           random={() => 0.5}>
                    {(cloudWords) => cloudWords.map((w, i) => (
                        <Text className="neon-text" key={w.text} textAnchor={'middle'}
                              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                              fill="#ffffff"
                              fontSize={w.size} fontFamily={w.font}>{w.text}</Text>
                    ))}
                </Wordcloud>
            ) : <div/>}
            {/*{sortBy(Object.entries(data), value => -value[1].length).slice(0, 5).map(currentData => (*/}
            {/*    <Wordcloud key={currentData[0]} width={512} height={512} words={(() => {*/}
            {/*        const [main, answers] = currentData*/}

            {/*        return answers.map(value => {*/}
            {/*            return {*/}
            {/*                text: value.answer,*/}
            {/*                value: (value.count + (value.answer === main ? 1 : 0)) * 1000*/}
            {/*            }*/}
            {/*        })*/}
            {/*    })()}*/}
            {/*               rotate={0}>*/}
            {/*        {(cloudWords) => cloudWords.map((w, i) => (*/}
            {/*            <Text key={w.text} textAnchor={'middle'}*/}
            {/*                  transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}*/}
            {/*                  fill="#ffffff"*/}
            {/*                  fontSize={w.size} fontFamily={w.font}>{w.text}</Text>*/}
            {/*        ))}*/}
            {/*    </Wordcloud>*/}
            {/*))}*/}
        </div>
        <div className="qr-code-section">
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Default file input example</Form.Label>
                <Form.Control type="file" onChange={handleFile}/>
            </Form.Group>
        </div>
    </div>
}