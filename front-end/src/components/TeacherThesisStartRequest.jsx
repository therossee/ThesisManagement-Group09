import { useState, useEffect } from 'react';
import { Alert, Avatar, Button, Badge, Row, Col, Tabs, Divider, Typography, List, Modal, Flex, Tooltip, Input, message, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, InfoCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { renderTeacherInfo } from './StudentThesisStartRequest';
import { getStatus } from './utils.jsx';
import PropTypes from 'prop-types';
import API from '../API';

dayjs.extend(localizedFormat);

function TeacherThesisStartRequest() {

    const [dirty, setDirty] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [tsr, setTsr] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [requestedChanges, setRequestedChanges] = useState("");

    const [selectedTsr, setSelectedTsr] = useState(null);

    // Host the TSR object we have to show
    const [showInfo, setShowInfo] = useState(null);

    const reviewTsr = async () => {
        try {
            await API.reviewThesisStartRequest(selectedTsr.id, requestedChanges);
            message.success("Successfully requested changes for " + selectedTsr.student.surname + " " + selectedTsr.student.name + "'s request");
            setDirty(true);
            setIsModalVisible(false);
            setRequestedChanges("");
            setSelectedTsr(null);
            setShowInfo(null);
        } catch (err) {
            message.error(err.message ?? err);
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
                message.error(err.message ?? err);
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
            onOk={() => reviewTsr()}
            onCancel={() => { setIsModalVisible(false); setRequestedChanges(""); setSelectedTsr(null) }}
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
                                setIsModalVisible={setIsModalVisible} setSelectedTsr={setSelectedTsr} setShowInfo={setShowInfo} />,
                        },
                        {
                            key: '2',
                            label: <span><HistoryOutlined />Decisions History</span>,
                            children: <HistoryThesisStartRequest tsr={tsr} isLoading={isLoading} setShowInfo={setShowInfo} />,
                        },
                    ]}
                />
            </Col>
            <Col span={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Divider type="vertical" style={{ height: '100%' }} />
            </Col>
            <Col span={10} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ShowTsrInfo showInfo={showInfo} />
            </Col>
        </Row>
    </>
    )
}

function PendingThesisStartRequest({ tsr, isLoading, setDirty, setIsModalVisible, setSelectedTsr, setShowInfo }) {

    const acceptTsr = async (tsrId, student) => {
        try {
            await API.acceptThesisStartRequest(tsrId);
            message.success("Successfully accepted the request of student " + student.surname + " " + student.name);
            setDirty(true);
            setShowInfo(null);
        } catch (err) {
            message.error(err.message ?? err);
        }
    };

    const rejectTsr = async (tsrId, student) => {
        try {
            await API.rejectThesisStartRequest(tsrId);
            message.success("Successfully rejected the request of student " + student.surname + " " + student.name);
            setDirty(true);
            setShowInfo(null);
        } catch (err) {
            message.error(err.message ?? err);
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
              <ThesisRequestItem
                tsr={tsr}
                setShowInfo={setShowInfo}
                showModal={showModal}
                acceptTsr={acceptTsr}
                rejectTsr={rejectTsr}
                setSelectedTsr={setSelectedTsr}
                setIsModalVisible={setIsModalVisible}
                isPending={true} // Pass a prop to indicate it's a pending request
              />
            )}
          >
          </List>
        );
    } else {
        return <Alert message="Good job, it seems like there is no pending request!" type="info" showIcon closable />;
    }
}

function HistoryThesisStartRequest({ tsr, isLoading, setShowInfo }) {

    if (tsr.some(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')) {
        return (
          <List
            loading={isLoading}
            itemLayout="horizontal"
            pagination={{ position: "bottom", align: "center" }}
            dataSource={tsr.filter(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')}
            renderItem={(tsr) => (
              <ThesisRequestItem
                tsr={tsr}
                setShowInfo={setShowInfo}
                showModal={showModal}
                isPending={false} // Pass a prop to indicate it's not a pending request
              />
            )}
          >
          </List>
        );
    } else {
        return <Alert message="It seems like there is nothing to show here..." type="info" showIcon closable />;
    }
}

function ThesisRequestItem({ tsr, setShowInfo, showModal, acceptTsr, rejectTsr, isPending, setSelectedTsr, setIsModalVisible }) {
    const { Paragraph, Text } = Typography;
  
    return (
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
            <Tooltip title="Thesis Start Request info">
              <Button type="dashed"
                icon={<InfoCircleOutlined />}
                onClick={() => setShowInfo(tsr)}
              />
            </Tooltip>
            {isPending && (
              <>
                <Button type="dashed" onClick={() => { setSelectedTsr(tsr); setIsModalVisible(true) }}>
                  Request Changes
                </Button>
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
                      );
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
                      );
                    }}
                  />
                </Tooltip>
              </>
            )}
          </Flex>
        </div>
      </List.Item>
    );
}
  
function ShowTsrInfo({ showInfo }) {
    if (!showInfo)
        return <Alert message={<span>Select the <InfoCircleOutlined /> icon on a Thesis Start Request to show its information!</span>} type="info" showIcon closable />
    else {
        const items = [
            {
                key: '1',
                label: 'Thesis Start Request Title',
                span: 2,
                children: showInfo.title,
            },
            {
                key: '2',
                label: 'Submitted on',
                span: 1,
                children: dayjs(showInfo.creation_date).format('LLL'),
            },
            {
                key: '3',
                label: 'Supervisor',
                span: 2,
                children: renderTeacherInfo(showInfo.supervisor.name, showInfo.supervisor.surname),
            },
            {
                key: '4',
                label: 'Supervisor ID',
                span: 1,
                children: showInfo.supervisor.id,
            },
            {
                key: '5',
                label: 'Status',
                span: 2,
                children: getStatus(showInfo.status),
            },
            {
                key: '6',
                label: 'Approval Date',
                span: 1,
                children: showInfo.approval_date ? dayjs(showInfo.approval_date).format('LLL') : "Not approved",
            },
            {
                key: '7',
                label: 'Description',
                span: 3,
                children: showInfo.description,
            },
        ];

        // Add co-supervisors to the items array
        showInfo.co_supervisors.forEach((cosupervisor, index) => {
            const cosupervisorItem = {
                key: `co-supervisor-${index}`,
                label: `Co-Supervisor #${index + 1}`,
                span: 2,
                children: renderTeacherInfo(cosupervisor.name, cosupervisor.surname),
            };
            const cosupervisorIdItem = {
                key: `co-supervisor-id-${index}`,
                label: `Co-Supervisor #${index + 1} ID`,
                span: 1,
                children: cosupervisor.id,
            };
            items.splice(4 + index * 2, 0, cosupervisorItem, cosupervisorIdItem);
        });

        return (
            <>
                {showInfo.status === 'changes requested' && <Alert
                    message="You requested changes to this submission!"
                    description={<><strong>Your Message:</strong> {showInfo.changes_requested}</>}
                    type="warning"
                    showIcon
                    closable
                />}
                <Descriptions
                    bordered
                    layout="vertical"
                    size="small"
                    column={3}
                    items={items}
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ marginTop: "10px" }} />
            </>
        )
    }
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
            return "rgb(255, 77, 79)";
        case "changes requested":
            return "rgb(250, 173, 20)";
        default:
            return "rgb(22, 119, 255)";
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

PendingThesisStartRequest.propTypes = {
    tsr: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setDirty: PropTypes.func.isRequired,
    setIsModalVisible: PropTypes.func.isRequired,
    setSelectedTsr: PropTypes.func.isRequired,
    setShowInfo: PropTypes.func.isRequired,
};

HistoryThesisStartRequest.propTypes = {
    tsr: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setShowInfo: PropTypes.func.isRequired,
};

ThesisRequestItem.propTypes = {
    tsr: PropTypes.array.isRequired,
    setShowInfo: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    acceptTsr: PropTypes.func,
    rejectTsr: PropTypes.func,
    isPending: PropTypes.bool.isRequired,
    setSelectedTsr: PropTypes.func.isRequired,
    setIsModalVisible: PropTypes.func.isRequired,
};

ShowTsrInfo.propTypes = {
    showInfo: PropTypes.shape({
        title: PropTypes.string.isRequired,
        creation_date: PropTypes.string.isRequired,
        supervisor: PropTypes.shape({
            name: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        }).isRequired,
        status: PropTypes.string.isRequired,
        approval_date: PropTypes.string,
        description: PropTypes.string.isRequired,
        co_supervisors: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })),
        changes_requested: PropTypes.string,
    }),
};


export default TeacherThesisStartRequest;