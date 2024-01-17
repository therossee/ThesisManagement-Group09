import { useState, useEffect } from 'react';
import { Alert, Avatar, Button, Row, Col, Tabs, Divider, Typography, List, Modal, Flex, Tooltip, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, InfoCircleOutlined, UserOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import API from '../API';

function TeacherThesisStartRequest() {

    const [dirty, setDirty] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [tsr, setTsr] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [requestedChanges, setRequestedChanges] = useState("")

    const reviewTsr = async (tsrId, student) => {
        try {
            await API.reviewThesisStartRequest(tsrId, requestedChanges);
            message.success("Successfully requested changes for " + student.surname + " " + student.name + "'s request");
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dirty) {
                    setIsLoading(true);
                    const tsr = await API.getTeacherThesisStartRequest();
                    setTsr(tsr);
                }
            } catch (err) {
                message.error(err.message ? err.message : err);
            }
            finally {
                setIsLoading(false);
                setDirty(false);
            }
        };
        fetchData();
    }, [dirty]);

    return (<>
        <Modal title="Request Changes"
            open={isModalVisible}
            onOk={() => reviewTsr(tsr.id, tsr.student, requestedChanges)}
            onCancel={() => { setIsModalVisible(false); setRequestedChanges("") }}
            okText="Request Changes"
            okType="danger"
        >
            <Input.TextArea rows={4} value={requestedChanges} onChange={(e) => setRequestedChanges(e.target.value)} />
        </Modal>
        <Row style={{ height: '100%' }}>
            <Col span={13} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    onChange={() => setDirty(true)}
                    style={{ height: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: <span><CheckOutlined />Pending Thesis Start Request</span>,
                            children: <PendingThesisStartRequest tsr={tsr} isLoading={isLoading} setDirty={setDirty}
                                isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />,
                        },
                        {
                            key: '2',
                            label: <span><HistoryOutlined />Decisions History</span>,
                            children: <HistoryThesisStartRequest tsr={tsr} isLoading={isLoading} />,
                        },
                    ]}
                />
            </Col>
            <Col span={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Divider type="vertical" style={{ height: '100%' }} />
            </Col>
        </Row>
    </>
    )
}

function PendingThesisStartRequest({ tsr, isLoading, setDirty, setIsModalVisible }) {

    const { Paragraph, Text } = Typography

    const acceptTsr = async (tsrId, student) => {
        try {
            await API.acceptThesisStartRequest(tsrId);
            message.success("Successfully accepted the request of student " + student.surname + " " + student.name);
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
        }
    };

    const rejectTsr = async (tsrId, student) => {
        try {
            await API.rejectThesisStartRequest(tsrId);
            message.success("Successfully rejected the request of student " + student.surname + " " + student.name);
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
        }
    };

    if (tsr.some(tsr => tsr.status === 'accepted by secretary' || tsr.status === 'changes requested')) {
        return (
            <List
                loading={isLoading}
                itemLayout="horizontal"
                pagination={{ position: "bottom", align: "center" }}
                dataSource={tsr.filter(tsr => tsr.status === 'accepted by secretary' || tsr.status === 'changes requested')}
                renderItem={(tsr) => (
                    <List.Item key={tsr.id}>
                        <div className={getWrapper(tsr.status)}>
                            <List.Item.Meta
                                avatar={<Avatar style={{
                                    backgroundColor: "transparent",
                                    color: getColor(tsr.status),
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} icon={getIcon(tsr.status)} size="large" />}
                                style={{ paddingLeft: ".75%", paddingRight: ".75%", paddingTop: ".5%", paddingBottom: ".5%" }}
                                title={tsr.title}
                                description={<div style={{ textAlign: "left", marginTop: "-5px" }}>{tsr.student.surname + " " + tsr.student.name + " - " + tsr.student.id}</div>}
                            />
                            <Flex wrap="wrap" gap="small" style={{ paddingRight: "1%", alignItems: 'center' }}>
                                <Tooltip title="Student info">
                                    <Button type="dashed"
                                        icon={<UserOutlined />}
                                        onClick={() => { <></> }}
                                    />
                                </Tooltip>
                                <Tooltip title="Thesis Start Request info">
                                    <Button type="dashed"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => { <></> }}
                                    />
                                </Tooltip>
                                <Tooltip title="Accept Thesis Start Request">
                                    <Button type="dashed"
                                        icon={<CheckOutlined />}
                                        onClick={() => {
                                            showModal(
                                                <div>
                                                    <Paragraph>
                                                        <Text strong>
                                                            Are you sure you want to accept this thesis start request?
                                                        </Text>
                                                    </Paragraph>
                                                    <Paragraph>
                                                        <Text strong>Thesis Start Request title: </Text><Text>{tsr.title}</Text>
                                                        <br />
                                                        <Text strong>Student: </Text><Text>{tsr.student.name + " " + tsr.student.surname}</Text>
                                                    </Paragraph>
                                                </div>,
                                                () => acceptTsr(tsr.id, tsr.student),
                                                "Yes, accept the request",
                                                "Cancel"
                                            )
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Reject Thesis Start Request">
                                    <Button danger type="dashed"
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            showModal(
                                                <div>
                                                    <Paragraph>
                                                        <Text strong>
                                                            Are you sure you want to reject this thesis start request?
                                                        </Text>
                                                    </Paragraph>
                                                    <Paragraph>
                                                        <Text strong>Thesis Start Request title: </Text><Text>{tsr.title}</Text>
                                                        <br />
                                                        <Text strong>Student: </Text><Text>{tsr.student.name + " " + tsr.student.surname}</Text>
                                                    </Paragraph>
                                                </div>,
                                                () => rejectTsr(tsr.id, tsr.student),
                                                "Yes, reject the request",
                                                "Cancel"
                                            )
                                        }}
                                    />
                                </Tooltip>
                                <Button type="dashed" onClick={() => setIsModalVisible(true)}>
                                    Request Changes
                                </Button>
                            </Flex>
                        </div>
                    </List.Item>
                )}
            >
            </List>
        )
    }
    else
        return <Alert message="Good job, it seems like there is no peding request!" type="info" showIcon closable />
}

function HistoryThesisStartRequest({ tsr, isLoading }) {

    if (tsr.some(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')) {
        return (
            <List
                loading={isLoading}
                itemLayout="horizontal"
                pagination={{ position: "bottom", align: "center" }}
                dataSource={tsr.filter(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')}
                renderItem={(tsr) => (
                    <List.Item key={tsr.id}>
                        <div className={getWrapper(tsr.status)}>
                            <List.Item.Meta
                                avatar={<Avatar style={{
                                    backgroundColor: "transparent",
                                    color: getColor(tsr.status),
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} icon={getIcon(tsr.status)} size="large" />}
                                style={{ paddingLeft: ".75%", paddingRight: ".75%", paddingTop: ".5%", paddingBottom: ".5%" }}
                                title={tsr.title}
                                description={<div style={{ textAlign: "left", marginTop: "-5px" }}>{tsr.student.surname + " " + tsr.student.name + " - " + tsr.student.id}</div>}
                            />
                            <Flex wrap="wrap" gap="small" style={{ paddingRight: "1%", alignItems: 'center' }}>
                                <Tooltip title="Student info">
                                    <Button type="dashed"
                                        icon={<UserOutlined />}
                                        onClick={() => { <></> }}
                                    />
                                </Tooltip>
                                <Tooltip title="Thesis Start Request info">
                                    <Button type="dashed"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => { <></> }}
                                    />
                                </Tooltip>
                            </Flex>
                        </div>
                    </List.Item>
                )}
            >
            </List>
        )
    }
    else
        return <Alert message="It seems like there is nothing to show here..." type="info" showIcon closable />
}

function getWrapper(status) {
    switch (status) {
        case "accepted by teacher":
            return "wrapper-accepted";
        case "rejected by teacher":
            return "wrapper-rejected";
        case "changes requested":
            return "wrapper-changes-requested";
        default:
            return "wrapper-pending";
    }
}

function getColor(status) {
    switch (status) {
        case "accepted by teacher":
            return "rgb(0, 204, 0)";
        case "rejected by teacher":
            return "rgb(255,77,79)";
        case "changes requested":
            return "rgb(250,173,20)";
        default:
            return "rgb(22,119,255)";
    }
}

function getIcon(status) {
    switch (status) {
        case "accepted by teacher":
            return <CheckCircleOutlined />;
        case "rejected by teacher":
            return <CloseCircleOutlined />;
        case "changes requested":
            return <ClockCircleOutlined />;
        default:
            return <InfoCircleOutlined />;
    }
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
};

export default TeacherThesisStartRequest;