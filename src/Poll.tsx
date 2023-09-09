import {Params, useLoaderData} from "react-router-dom";
import {Button, Form} from "react-bootstrap";

interface Question {
    text: string
}

async function getQuestion(pollId: string): Promise<Question> {
    return {
        text: `Question №${pollId}`
    }
}

export async function loader({ params }: { params: Params }) {
    const question = await getQuestion(params.pollId!)
    return { question }
}

export function Poll() {
    const { question } = useLoaderData() as { question: Question }
    return <div className="Poll">
        <Form.Label htmlFor="questionAnswer">{question.text}</Form.Label>
        <Form.Control type="text" id="questionAnswer"/>
        <Button>Отправить</Button>
    </div>;
}