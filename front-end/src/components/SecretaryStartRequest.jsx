import { useState, useEffect} from "react";
import { message, Typography, Modal, Card } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import StartRequestsList from "./StartRequestsList";
import API from "../API";
const { Meta } = Card;


function Secretary() {

    // List of objects for storing thesis info and applications
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [buttonsLoading, setButtonsLoading] = useState(false);

    const [dirty, setDirty] = useState(true);

    const { Title } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dirty) {
                    setIsLoading(true);
                    const newData = [];
                    const startRequests = await API.getSecretaryStartRequest();
                    startRequests.map((x) => {
                        newData.push(x);
                    })
                    setData(newData);
                    setIsLoading(false);
                    setDirty(false);
                    console.log(newData);
                }
            } catch (err) {
                message.error(err.message ? err.message : err);
            }
        };
        fetchData();
    }, [dirty]);

    const showModal = (content, action, okText, cancelText) => {
        Modal.confirm({
            title: "Confirm action",
            icon: <ExclamationCircleFilled />,
            content: content,
            onOk: action,
            okText: okText,
            okType: "danger",
            cancelText: cancelText,
        });
    };

    const acceptStartRequest = async (startReqId, student) => {
        setButtonsLoading(true);
        try {
            await API.secretaryAcceptStartRequest(startReqId);
            message.success("Accepted the start request of " + student.surname + " " + student.name);
            setDirty(true);
            setButtonsLoading(false)
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };


    const rejectStartRequest = async (startReqId, student) => {
        setButtonsLoading(true);
        try {
            await API.secretaryRejectStartRequest(startReqId, student.id);
            message.success("Rejected the start request of " + student.surname + " " + student.name);
            setDirty(true);
            setButtonsLoading(false);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };

    return (
        data.length > 0 ?
            <StartRequestsList
                data={data}
                isLoading={isLoading}
                buttonsLoading={buttonsLoading}
                acceptStartRequest={acceptStartRequest}
                rejectStartRequest={rejectStartRequest}
                showModal={showModal} 
            />
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No Start Requests pending..</Title>
            </div>
    )
}

export default Secretary;