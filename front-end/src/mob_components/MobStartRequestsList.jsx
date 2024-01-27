import {useState} from 'react';
import { Tag, Typography, Card, Avatar } from 'antd';
import { ExclamationCircleFilled, CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { Collapse, Button, Modal } from 'antd-mobile';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const { Text } = Typography;

function MobStartRequestsList({ data, acceptStartRequest, rejectStartRequest }) {

    const [view, setView] = useState(false);
    const [tsr, setTsr] = useState(null);

    const handleView = (tsr) => {
        setTsr(tsr);
        setView(true);
    }

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
    }

    return (
        <>
        {view === false ? (<div style={{ marginRight: "2%", marginLeft: "2%", marginBottom: '70px' }}>
            <Collapse accordion>
                {data.map((request) => (
                    <Collapse.Panel
                        key={request.id}
                        title={<>
                            <div>
                                <Text strong>{request.student.surname + " " + request.student.name + " "}</Text>
                                <Tag color="default">{request.student.id }</Tag>
                            </div>
                            <span> </span>
                            {request.title}
                        </>}>
                        <div style={{ display: 'flex' }}>
                            <Text strong>Status:</Text>
                            <div style={{ marginLeft: '10px', marginTop: '1px' }}><Tag color={`${getStatusColor(request.status)}` }>{request.status}</Tag></div>
                        </div>
                        <div>
                            <Text strong>Creation Date:</Text>
                            <div style={{ marginLeft: '5px', display: 'inline-block' }}>
                                {dayjs(request.creation_date).format('DD-MM-YYYY HH:mm')}
                            </div>

                            {(request.approvation_date) && (
                                <div>
                                    <Text strong>{"Approvation Date: "}</Text>
                                    <div style={{ marginLeft: '5px', display: 'inline-block' }}>
                                        {dayjs(request.approvation_date).format('DD-MM-YYYY HH:mm')}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <Text strong>{"Title: "}</Text>
                            {request.title}
                        </div>
                        <div style={{paddingTop: '3px'}}>
                            <Text strong={true}>{"Supervisor: "}</Text>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ margin: '0', marginRight: '10px' }}>- {request.supervisor.surname + " " + request.supervisor.name}</p>
                                    <Tag color="blue">{request.supervisor.id }</Tag>
                                </div>
                            </div>

                        <div style={{ paddingTop: '10px', textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}>
                            <Button onClick={() => handleView(request)}>View</Button>
                            {(!checkStatusButtons(request.status)) &&
                                <>
                                    <Button onClick={() => handleAccept(request.id, request.student, acceptStartRequest)}><CheckOutlined/>    Accept</Button>
                                    <Button onClick={() => handleReject(request.id, request.student, rejectStartRequest)}><CloseOutlined/>    Reject</Button>
                                </>
                            }
                        </div>

                    </Collapse.Panel>
                ))}
            </Collapse>
        </div>) : (<ViewTSR tsr={tsr} setView={setView} acceptStartRequest={acceptStartRequest} rejectStartRequest={rejectStartRequest}/> )}
            </>
    )
}

function ViewTSR({ tsr, setView, acceptStartRequest, rejectStartRequest }){

    const { Meta } = Card;
    const { Paragraph, Text } = Typography;

    const handleGoBack = () => {
        setView(false);
    }

    return (

        <div style={{ marginRight: "2%", marginLeft: "2%", marginBottom: '70px' }}>
            <Button type="link" onClick={handleGoBack}>
                &lt;    {"Back to Start Requests List"}
            </Button>
            <div style={{ display: 'flex', paddingTop: '15px' }}>
                <Text strong>Status:</Text>
                <div style={{ marginLeft: '10px', marginTop: '1px' }}><Tag color={`${getStatusColor(tsr.status)}` }>{tsr.status}</Tag></div>
            </div>
            <div style={{paddingTop: "3%"}}>
                <Text strong>Creation Date:</Text>
                <div style={{ marginLeft: '5px', display: 'inline-block' }}>
                    {dayjs(tsr.creation_date).format('DD-MM-YYYY HH:mm')}
                </div>

                {(tsr.approvation_date) && (
                    <div>
                        <Text strong>{"Approvation Date: "}</Text>
                        <div style={{ marginLeft: '5px', display: 'inline-block' }}>
                            {dayjs(tsr.approvation_date).format('DD-MM-YYYY HH:mm')}
                        </div>
                    </div>
                )}
            </div>

            <div style={{paddingTop: "3%"}}>
                <Text strong>{"Title: "}</Text>
                {tsr.title}
            </div>
            <div style={{paddingTop: "3%"}}>
                <Paragraph>
                    <Text strong>{"Description: "}</Text>
                    {tsr.description}
                </Paragraph>
            </div>
            <div style={{paddingTop: '3px'}}>
                <Paragraph strong={true}>{"Supervisor: "}</Paragraph>
                <Tag color='blue' style={{ display: 'inline-block', padding: '0', borderRadius: '4px', backgroundColor: '#f0f5ff', marginRight: '8px', marginBottom: '10px' }}>
                    <Meta
                        style={{ padding: '8px', display: 'block'}}
                        title={<Text>{tsr.supervisor.surname + " " + tsr.supervisor.name + " (" + tsr.supervisor.id + ") "}</Text>}
                        description={
                            <div style={{ marginTop: "-1%" }}>
                                {tsr.supervisor.cod_department + " • " + tsr.supervisor.cod_group}
                            </div>
                        }
                    />
                </Tag>
                </div>
            {tsr.co_supervisors.length === 0 ? null :
                <div>
                    <Text strong={true}>{"Cosupervisors: "}</Text>
                    {tsr.co_supervisors.map((co_supervisor) => (
                        <Meta
                            key={co_supervisor.id}
                            avatar={<Avatar style={{ backgroundColor: 'grey' }} icon={<UserOutlined />} size="small" />}
                            style={{ marginTop: "2%", display: 'flex', alignItems: 'inline-block' }}
                            title={<Text strong={true} style={{paddingLeft: '5px'}}>{co_supervisor.surname + " " + co_supervisor.name + " (" + co_supervisor.id + ") "}</Text>}
                        />
                    ))}
                </div>
            }
            {(!checkStatusButtons(tsr.status)) &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button style={{marginRight: '3%'}} onClick={() => handleAccept(tsr.id, tsr.student, acceptStartRequest)}><CheckOutlined /> Accept</Button>
                    <Button style={{marginLeft: '3%'}} onClick={() => handleReject(tsr.id, tsr.student, rejectStartRequest)}><CloseOutlined /> Reject</Button>
                </div>

            }
        </div>
);

}

const checkStatusButtons = (status) => {
    return (status.includes("accepted") || status.includes("rejected")) ? true : false;

}

const getStatusColor = (status) => {
    if (status.includes("accepted")) {
        return "rgb(0, 204, 0)";
    } else if (status.includes("rejected")) {
        return "rgb(255, 77, 79)";
    } else {
        return "grey";
    }
};

const handleAccept = (startReqId, student, acceptStartRequest) => {
    acceptStartRequest(startReqId, student);
}

const handleReject = (startReqId, student, rejectStartRequest) => {
    rejectStartRequest(startReqId, student);
}

MobStartRequestsList.propTypes = {
    data: PropTypes.array.isRequired,
};

ViewTSR.propTypes = {
    tsr: PropTypes.object.isRequired,
    setView: PropTypes.func.isRequired,
    acceptStartRequest: PropTypes.func.isRequired,
    rejectStartRequest: PropTypes.func.isRequired,
}

export default MobStartRequestsList;