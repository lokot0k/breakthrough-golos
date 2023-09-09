import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import QRCode from 'react-qr-code'
import {useState} from "react";
import {useNavigate} from "react-router-dom";


export function Constructor() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)

    const handleShow = () => {
        navigate(`/poll/admin/${Math.ceil(Math.random() * 90000 + 10000)}`)
    };
    
    return <div className="Constructor">
        <div className="constructor-form">
            <InputGroup>
                <InputGroup.Text>Текст вопроса</InputGroup.Text>
                <Form.Control type="text" id="inputQuestionText"/>
                <Button onClick={handleShow}>Начать</Button>
            </InputGroup>
        </div>
    </div>
}