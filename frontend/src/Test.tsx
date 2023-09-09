import {Form} from "react-bootstrap"
import {ChangeEventHandler, useState} from "react";
import _, {sortBy, sumBy, words} from "lodash";
import {Dropdown} from "./Dropdown";
import {Sentiments} from "./utils";
import {ParentSize} from "@visx/responsive";
import {CustomWordCloud} from "./wordcloud";
import {FormControl, FormControlLabel, Radio, RadioGroup, Switch, ToggleButton} from "@mui/material";
import {DonughtStat} from "./Donught";
import {HorizontalChart} from "./HorizontalChart";
import './App.css'
import donught from './assets/donught.svg'
import dropdown from './assets/dropdown.svg'
import horizontalChart from './assets/horizontal_chart.svg'
import wordCloud from './assets/word_cloud.svg'
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
let jsonTxt = "";

export function Test() {
    const [censure, setCensure] = useState(false);
    const [fast, setFast] = useState(false);
    const [correction, setCorrection] = useState(false);
    const [filename, setFilename] = useState("Загрузить файл");
    const [demoType, setDemoType] = useState("dd");
    const [question, setQuestion] = useState("Выберите файл...");
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState({} as _.Dictionary<LabeledAnswer[]>);
    const [words, setWords] = useState([] as WordData[]);

    const makeRequest = async ()=>{
        if(jsonTxt === ""){
            return
        }
        setLoading(true)
        console.log('{' + '"censure": '+ censure+", "+'"fast": '+fast+", "+'"data": ' + jsonTxt+'}')
        const response = await fetch("/api/do_good/", {
            method: "POST",
            //mode: 'no-cors',
            headers: {"Content-Type": "application/json"},
            body: '{' + '"censure": '+ censure+", "+'"fast": '+fast+', "correction": ' + correction +', "data": ' + jsonTxt+'}'

        })
        if(!response.ok){
            setLoading(false);
            return;
        }
        const data: LabeledData = await response.json()
        const clusters = _.groupBy(data.answers, 'cluster')
        setData(clusters)
        setQuestion(data.question)
        setLoading(false)
    }
    const handleFile: ChangeEventHandler<HTMLInputElement> = async event => {
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            const text = await file.text();
            if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                setFilename(file.name)
                jsonTxt = text;
                await makeRequest();
            }
        } else {
            setFilename("Загрузить файл")
        }
    }


    return <div className="Test">
        <div className="header">
            <img src={png} style={{aspectRatio: "320/39", height: "50%", marginTop: "25px", marginLeft: "25px"}}></img>
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
                            (<div className="progress-bar-container"><div className="progress-bar">
                                <div className="circle circle-border">
                                </div>
                            </div></div>)
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
            <div className="settings-section">
                <div className="settings-container">
                    <h1>Отображение</h1>
                    <FormControlLabel labelPlacement={"start"} value={censure}
                                      onChange={(event, checked) => {
                                          setCensure(checked)
                                          makeRequest().then(r => {})
                                      }} control={<Switch/>}
                                      label={"Цензура"}/>
                    <br/>
                    <FormControlLabel labelPlacement={"start"} value={fast}
                                      onChange={(event, checked) => {
                                          setFast(checked)
                                          makeRequest().then(r => {})
                                      }}
                                      control={<Switch/>}
                                      label={"Быстрее (но хуже)"}/>
                    <br/>
                    <FormControlLabel labelPlacement={"start"} value={correction}
                                      onChange={(event, checked) => {
                                          setCorrection(checked)
                                          makeRequest().then(r => {})
                                      }}
                                      control={<Switch/>}
                                      label={"Автокоррекция"}/>
                    <RadioGroup className={"radio-demo-type-group"} value={demoType} defaultValue="dd"
                                onChange={(event, value) => setDemoType(value)}>
                        <FormControlLabel control={<Radio className={"radio-demo-type-button"}/>}
                                          label={<img src={dropdown}/>} value="dd"/>
                        <FormControlLabel control={<Radio className={"radio-demo-type-button"}/>}
                                          label={<img src={wordCloud}/>} value="wc"/>
                        <FormControlLabel control={<Radio className={"radio-demo-type-button"}/>}
                                          label={<img src={horizontalChart}/>} value="hc"/>
                        <FormControlLabel control={<Radio className={"radio-demo-type-button"}/>}
                                          label={<img src={donught}/>} value="dn"/>
                    </RadioGroup>
                </div>
            </div>
        </div>
    </div>
}