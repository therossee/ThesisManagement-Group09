import { useState, useEffect } from "react";
import { message, List, Avatar, Button, Flex, Typography, Tooltip, Modal, Badge, Card } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import API from "../API";
const { Meta } = Card;


function Secretary() {

    // List of objects for storing thesis info and applications
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [buttonsLoading, setButtonsLoading] = useState(false);

    const [dirty, setDirty] = useState(true);

    const { Title, Paragraph, Text } = Typography;

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
            await API.acceptStartRequest(startReqId);
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
            await API.rejectStartRequest(startReqId, student.id);
            message.success("Rejected the start request of " + student.surname + " " + student.name);
            setDirty(true);
            setButtonsLoading(false);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };

    function StartRequestsList() {
        console.log(data);
        return (
            <>
                <div style={{ marginRight: "18%", marginLeft: "18%" }}>
                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(request) => (
                            <>
                                <Badge.Ribbon color={request.status.includes("accepted") ? "green" : (request.status.includes("rejected") ? "red" : "grey")} text={request.status}>
                                    <Card key={request.id}>
                                            <Meta
                                                    avatar={<Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} size="large" />}
                                                    title={request.student.surname + " " + request.student.name + " (" + request.student.id + ") "}
                                                    description={
                                                        <>
                                                            <div style={{ marginTop: "-5px" }}>
                                                                {"Creation Date: " + dayjs(request.creation_date).format('DD-MM-YYYY HH:mm')}
                                                                {request.approvation_date && <div><strong>{"Approvation Date: "}</strong>{dayjs(request.approvation_date).format('DD-MM-YYYY HH:mm')}</div>}
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            
                                        <p><strong>{"Thesis Title: "}</strong>{request.title}</p>
                                        <p><strong>{"Description: "}</strong>{request.description}</p>
                                        <p><strong>{"Supervisor: "}</strong></p>
                                        <Meta
                                            avatar={<Avatar style={{ backgroundColor: '#b62f2f' }} icon={<UserOutlined />} size="small" />}
                                            style={{ padding: ".5%" }}
                                            title={request.supervisor.surname + " " + request.supervisor.name + " (" + request.supervisor.id + ") "}
                                            description={
                                                <>
                                                    <div style={{ marginTop: "-1%" }}>
                                                        {request.supervisor.cod_department + " • " + request.supervisor.cod_group}
                                                    </div>
                                                </>}
                                        />
                                        {request.co_supervisors.length == 0 ? null :
                                            <p>
                                                <strong>{"Cosupervisors: "}</strong>
                                                {request.co_supervisors.map((co_supervisor) => (

                                                    <Meta
                                                        avatar={<Avatar style={{ backgroundColor: '#3CB371' }} icon={<UserOutlined />} size="small" />}
                                                        style={{ padding: ".5%" }}
                                                        title={co_supervisor.surname + " " + co_supervisor.name + " (" + co_supervisor.id + ") "}
                                                    />



                                                ))}
                                            </p>
                                        }
                                        <Flex wrap="wrap" gap="small" style={{ padding: ".5%", alignItems: 'center', paddingTop: '2%' }}>
                                            <Tooltip title="Accept Start Request">
                                                <Button ghost type="primary"
                                                    loading={buttonsLoading}
                                                    disabled={buttonsLoading || request.status !== "waiting for approval"}
                                                    icon={<CheckOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showModal(
                                                            <div>
                                                                <Paragraph>
                                                                    <Text strong>
                                                                        Are you sure you want to accept this start request?
                                                                    </Text>
                                                                </Paragraph>
                                                                <Paragraph>
                                                                    <Text strong>Thesis title: </Text><Text>{request.title}</Text>
                                                                    <br />
                                                                    <Text strong>Student: </Text><Text>{request.student.name + " " + request.student.surname}</Text>
                                                                </Paragraph>
                                                            </div>,
                                                            () => acceptStartRequest(request.id, request.student),
                                                            "Yes, accept the start request",
                                                            "Cancel"
                                                        )
                                                    }}
                                                >ACCEPT</Button>
                                            </Tooltip>
                                            <Tooltip title="Reject Start Request">
                                                <Button ghost danger
                                                    loading={buttonsLoading}
                                                    disabled={buttonsLoading || request.status !== "waiting for approval"}
                                                    icon={<CloseOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showModal(
                                                            <div>
                                                                <Paragraph>
                                                                    <Text strong>
                                                                        Are you sure you want to reject this start request?
                                                                    </Text>
                                                                </Paragraph>
                                                                <Paragraph>
                                                                    <Text strong>Thesis title: </Text><Text>{request.title}</Text>
                                                                    <br />
                                                                    <Text strong>Student: </Text><Text>{request.student.name + " " + request.student.surname}</Text>
                                                                </Paragraph>
                                                            </div>,
                                                            () => rejectStartRequest(request.id, request.student),
                                                            "Yes, reject the start request",
                                                            "Cancel"
                                                        )
                                                    }}
                                                >REJECT</Button>
                                            </Tooltip>
                                        </Flex>
                                    </Card>
                                </Badge.Ribbon>
                                <br />

                            </>
                        )}
                    />
                </div>
            </>
        )
    }

    return (
        data.length > 0 ?
            <>
                <StartRequestsList />
            </>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No Start Requests pending..</Title>
            </div>
    )
}

export default Secretary;