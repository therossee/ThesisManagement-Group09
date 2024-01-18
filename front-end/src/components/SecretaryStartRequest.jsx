import { useState, useEffect} from "react";
import { message, Typography, Modal} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import StartRequestsList from "./StartRequestsList";
import API from "../API";

function Secretary() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonsLoading, setButtonsLoading] = useState(false);
    const [dirty, setDirty] = useState(true);

    const { Title } = Typography;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (dirty) {
                const startRequests = await API.getSecretaryStartRequest();
                setData(startRequests);
                setDirty(false);
            }
        } catch (err) {
            message.error(err.message ? err.message : err);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleStartRequest = async (startReqId, student, actionFunction, successMessage) => {
        setButtonsLoading(true);
        try {
            await actionFunction(startReqId, student.id);
            message.success(`${successMessage} ${student.surname} ${student.name}`);
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
        } finally {
            setButtonsLoading(false);
        }
    };

    const acceptStartRequest = (startReqId, student) => {
        handleStartRequest(startReqId, student, API.acceptStartRequest, "Accepted the start request of");
    };

    const rejectStartRequest = (startReqId, student) => {
        handleStartRequest(startReqId, student, API.rejectStartRequest, "Rejected the start request of");
    };

    useEffect(() => {
        fetchData();
    }, [dirty]);

    return (
        data.length > 0 ? (
            <StartRequestsList
                data={data}
                isLoading={isLoading}
                buttonsLoading={buttonsLoading}
                acceptStartRequest={acceptStartRequest}
                rejectStartRequest={rejectStartRequest}
                showModal={showModal} 
            />
        ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No Start Requests pending..</Title>
            </div>
        )
    );
}

export default Secretary;
