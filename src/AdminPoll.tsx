import {Params, useLoaderData} from "react-router-dom";
import QRCode from "react-qr-code";
import {Chart} from "./Chart";

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

export function AdminPoll() {
    const results = [
        "loasdf",
        "asdafdgsafdgafsd1",
        "asdfsajngasdfga",
    ]

    const {question} = useLoaderData() as { question: AdminQuestion }
    return <div className="AdminPoll">
        <div className="chart-section">
            <Chart results={results}/>
        </div>
        <div className="qr-code-section">
            <div className="qr-code-holder">
                <QRCode value={question.url}/>
            </div>
        </div>
    </div>
}