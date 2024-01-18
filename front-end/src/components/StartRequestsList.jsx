import React from 'react';
import { Badge, Card, Avatar, Button, Tooltip, Flex, Typography, List, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const { Meta } = Card;
const { Paragraph, Text } = Typography;

function StartRequestsList({ data, isLoading, buttonsLoading, acceptStartRequest, rejectStartRequest, showModal }) {

    const getStatusColor = (status) => {
        if (status.includes("accepted")) {
          return "rgb(0, 204, 0)";
        } else if (status.includes("rejected")) {
          return "rgb(255, 77, 79)";
        } else {
          return "grey";
        }
    };

    return (
            <div style={{ marginRight: "18%", marginLeft: "18%" }}>
                <List
                    loading={isLoading}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(request) => (
                            <Badge.Ribbon   
                                style={{
                                    border: `2px solid ${getStatusColor(request.status)}`,
                                    backgroundColor: 'white',
                                    padding: '5px',
                                    marginTop: '15px',
                                    marginBottom: '5px',
                                    color: `${getStatusColor(request.status)}`
                                }}
                                text={
                                    <span style={{ color: `${getStatusColor(request.status)}` }}>{request.status}</span>
                                }
                                >
                                <Card key={request.id} className='card-tsr' style={{marginBottom: '15px', paddingTop: '15px'}}>
                                        <Meta
                                            avatar={<Avatar style={{ backgroundColor: '#ffffff', color: '#1677ff', borderColor: '#1677ff' }} icon={<UserOutlined />} size="large" />}
                                            title={request.student.surname + " " + request.student.name + " (" + request.student.id + ") "}
                                            description={
                                                    <div style={{ marginTop: "-5px" }}>
                                                        {"Creation Date: " + dayjs(request.creation_date).format('DD-MM-YYYY HH:mm')}
                                                        {request.approvation_date && <div><strong>{"Approvation Date: "}</strong>{dayjs(request.approvation_date).format('DD-MM-YYYY HH:mm')}</div>}
                                                    </div>
                                            }
                                            style={{marginBottom: '15px', marginTop: '5px'}}
                                        />
                                        <Paragraph>
                                        <Text strong>{"Title: "}</Text>
                                        {request.title}
                                        </Paragraph>
                                        <Paragraph>
                                        <Text strong>{"Description: "}</Text>
                                        {request.description}
                                        </Paragraph>
                                        <Paragraph strong={true}>{"Supervisor: "}</Paragraph>
                                        <Tag color='blue' style={{ display: 'inline-block', padding: '0', borderRadius: '4px', backgroundColor: '#f0f5ff', marginRight: '8px', marginBottom: '10px' }}>
                                            <Meta
                                                style={{ padding: '8px', display: 'block'}}
                                                title={<Text>{request.supervisor.surname + " " + request.supervisor.name + " (" + request.supervisor.id + ") "}</Text>}
                                                description={
                                                    <div style={{ marginTop: "-1%" }}>
                                                        {request.supervisor.cod_department + " • " + request.supervisor.cod_group}
                                                    </div>
                                                }
                                            />
                                        </Tag>
                                        {request.co_supervisors.length == 0 ? null :
                                            <div>
                                                <Text strong={true}>{"Cosupervisors: "}</Text>
                                                {request.co_supervisors.map((co_supervisor) => (
                                                    <Meta
                                                        key={co_supervisor.id}
                                                        avatar={<Avatar style={{ backgroundColor: 'grey' }} icon={<UserOutlined />} size="small" />}
                                                        style={{ marginTop: "2%" }}
                                                        title={<Text strong={true}>{co_supervisor.surname + " " + co_supervisor.name + " (" + co_supervisor.id + ") "}</Text>}
                                                    />
                                                ))}
                                            </div>
                                        }
                                        <Flex wrap="wrap" gap="small" style={{ paddingTop: "3%", justifyContent: 'center' }}>
                                        {request.status === "waiting for approval" && (
                                            <>
                                            <Tooltip title="Accept Start Request" placement='bottom'>
                                                <Button ghost type="primary"
                                                    loading={buttonsLoading}
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
                                            <Tooltip title="Reject Start Request" placement='bottom'>
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
                                            </>    
                                        )}
                                        </Flex>
                                    </Card>
                            </Badge.Ribbon>
                    )}
                />
        </div>
    )
}

StartRequestsList.propTypes = {
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    buttonsLoading: PropTypes.bool.isRequired,
    acceptStartRequest: PropTypes.func.isRequired,
    rejectStartRequest: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired
};

export default StartRequestsList;