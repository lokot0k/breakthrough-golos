import {Form} from "react-bootstrap"
import {ChangeEventHandler, useState} from "react";
import _, {sortBy, sumBy, words} from "lodash";
import {Dropdown} from "./Dropdown";
import {Sentiments} from "./utils";
import {ParentSize} from "@visx/responsive";
import {CustomWordCloud} from "./wordcloud";
import {FormControlLabel, Radio, RadioGroup, Switch, ToggleButton} from "@mui/material";
import {DonughtStat} from "./Donught";
import {HorizontalChart} from "./HorizontalChart";
import './App.css'
import {json} from "react-router-dom";
import png from "./assets/logo.png";


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
    sentiment: Sentiments
}

interface WordData {
    text: string;
    value: number;
}

export function Test() {
    const [censure, setCensure] = useState(false);
    const [fast, setFast] = useState(false);
    const [filename, setFilename] = useState("Загрузить файл");
    const [demoType, setDemoType] = useState("dd");
    const [question, setQuestion] = useState("Выберите файл...");
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState({} as _.Dictionary<LabeledAnswer[]>);
    const [words, setWords] = useState([] as WordData[]);
    const handleFile: ChangeEventHandler<HTMLInputElement> = async event => {
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            setFilename(file.name)
            setLoading(true)
            const text = await file.text();
            const response = await fetch("/api/do_good/", {
                method: "POST",
                //mode: 'no-cors',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    censure,
                    fast,
                    data: JSON.parse(text)
                })
            })
            const data: LabeledData = await response.json()
            const clusters = _.groupBy(data.answers, 'cluster')
            setData(clusters)
            setQuestion(data.question)
            setLoading(false)
        } else {
            setFilename("Загрузить файл")
        }
    }


    return <div className="Test">
        <div className="header">
            <img src={png} style={{ aspectRatio: "320/39", height:"50%", marginTop: "25px", marginLeft:"25px"}}></img>
            <Form.Group controlId="formFile" className="file-loader mb-3">
                <Form.Label>{isLoading ? "Loading..." : filename}</Form.Label>
                <Form.Control style={({
                    display: "none"
                })} type="file" onChange={handleFile} disabled={isLoading}/>
            </Form.Group>
        </div>
        <div className="body">
            <div className="chart-section">
                <div className="question-holder">{question}</div>
                <div className="data-section">
                    {
                        isLoading ?
                            (<div className="progress-bar">
                                <div className="circle circle-border">
                                </div>
                            </div>)
                            :
                            ("dd" === demoType ?
                                <Dropdown data={data}/>
                                : "wc" === demoType && !_.isEmpty(data) ?
                                    <ParentSize>{({width, height}) => <CustomWordCloud width={width} height={height}
                                                                                       data={data}/>}</ParentSize>
                                    : "hc" === demoType ?
                                        <ParentSize>{({width, height}) => <HorizontalChart width={width} height={height}
                                                                                           data={data}/>}</ParentSize>
                                        : "dn" === demoType ? <DonughtStat results={data}/> : <div/>)
                    }
                </div>
            </div>
            <div className="qr-code-section">
                <FormControlLabel value={censure} onChange={(event, checked) => setCensure(checked)} control={<Switch/>}
                                  label={"Цензура"}/>
                <FormControlLabel value={fast} onChange={(event, checked) => setFast(checked)} control={<Switch/>}
                                  label={"Быстрее (но хуже)"}/>
                <RadioGroup value={demoType} defaultValue="dd" onChange={(event, value) => setDemoType(value)}>
                    <FormControlLabel control={<Radio/>} label="Dropdown" value="dd"/>
                    <FormControlLabel control={<Radio/>} label="Wordcloud" value="wc"/>
                    <FormControlLabel control={<Radio/>} label="Hortizontal Chart" value="hc"/>
                    <FormControlLabel control={<Radio/>} label="Donught" value="dn"/>
                </RadioGroup>
            </div>
        </div>
    </div>
}