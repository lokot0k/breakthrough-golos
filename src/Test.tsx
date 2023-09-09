import {Form} from "react-bootstrap"
import {ChangeEventHandler, useState} from "react";
import _, {sortBy, sumBy, words} from "lodash";
import {Dropdown} from "./Dropdown";


interface LabeledData {
    question: string
    id: number
    answers: LabeledAnswer[]
}

export interface LabeledAnswer {
    answer: string
    cluster: string
    corrected: string | null | undefined
    count: number
    sentiment: ["positives", "neutrals", "negatives"]
}

interface WordData {
    text: string;
    value: number;
}

export function Test() {
    const [question, setQuestion] = useState("Выберите файл...");
    const [data, setData] = useState({} as _.Dictionary<LabeledAnswer[]>);
    const [words, setWords] = useState([] as WordData[]);
    const handleFile: ChangeEventHandler<HTMLInputElement> = async event => {
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            const text = await file.text();
            const data: LabeledData = JSON.parse(text)
            const clusters = _.groupBy(data.answers, 'cluster')
            console.log(clusters)
            setData(clusters)
            setQuestion(data.question)

            setWords(Object.entries(clusters).map(([cluster, answers]) =>
                ({
                    text: cluster,
                    value: sumBy(answers, value => value.count),
                    // @ts-ignore
                    sentiment: (answers[0].sentiment === 'positives' || answers[0].sentiment === 'neutrals' || answers[0].sentiment === 'negatives') ? answers[0].sentiment : "neutrals",
                })
            ))
        }
    }


    return <div className="Test">
        <div className="header">

        </div>
        <div className="body">
            <div className="chart-section">
                <div className="question-holder">{question}</div>
                <div className="data-section">
                    <Dropdown data={data}/>
                    {/*{!_.isEmpty(data) ? (*/}
                    {/*    // @ts-ignore*/}
                    {/*    <ParentSize>{({ width, height }) => <CustomWordCloud width={width} height={height} words={words} />}</ParentSize>*/}
                    {/*) : <div/>}*/}
                </div>
            </div>
            <div className="qr-code-section">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" onChange={handleFile}/>
                </Form.Group>
            </div>
        </div>
    </div>
}