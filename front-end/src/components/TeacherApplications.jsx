import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Alert, message, Divider, List, Skeleton, Avatar, Button, Flex, Typography, Tooltip, Modal } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import API from "../API";
import StudentCV from "./StudentCV";

function TeacherApplications() {

    // List of objects for storing thesis info and applications
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [buttonsLoading, setButtonsLoading] = useState(false);

    const [dirty, setDirty] = useState(true);

    // Drawer for viewing student CV
    const [isOpen, setIsOpen] = useState(false);

    // Which student should be seen in the drawer?
    const [studentInfo, setStudentInfo] = useState(null);
    const [applicationId, setApplicationId] = useState(-1);

    const { Title, Paragraph, Text } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dirty) {
                    setIsLoading(true);
                    let newData = [];
                    const proposals = await API.getThesisProposals();
                    await Promise.all(
                        proposals.map(async (proposal) => {
                            const applications = await API.getTeacherThesisApplications(proposal.id);
                            if (applications.some((x) => x.status === "waiting for approval")) {
                                newData.push({
                                    id: proposal.id,
                                    title: proposal.title,
                                    applications: applications.filter((x) => x.status === "waiting for approval"),
                                });
                            }
                        })
                    );
                    setData(newData);
                    setIsLoading(false);
                    setDirty(false);
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

    const acceptApplication = async (proposalId, student) => {
        setButtonsLoading(true);
        try {
            await API.acceptThesisApplications(proposalId, student.id);
            message.success("Accepted the application of " + student.surname + " " + student.name);
            setDirty(true);
            setButtonsLoading(false)
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };


    const rejectApplication = async (proposalId, student) => {
        setButtonsLoading(true);
        try {
            await API.rejectThesisApplications(proposalId, student.id);
            message.success("Rejected the application of " + student.surname + " " + student.name);
            setDirty(true);
            setButtonsLoading(false);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };

    function ApplicationsList() {

        const navigate = useNavigate();

        let ApplicationList = data.map((x) => (
            <div key={x.id} >
                <Skeleton loading={isLoading} active title={false}>
                    <Divider orientation="center">
                        <div style={{ whiteSpace: "normal" }}>
                            <Link to={`/view-proposal/${x.id}`}>
                                <Title level={4} style={{ margin: "0" }} >
                                    {x.title}
                                </Title>
                            </Link>
                        </div>
                    </Divider>
                </Skeleton>
                <div style={{ marginRight: "18%", marginLeft: "18%" }}>
                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={x.applications}
                        renderItem={(student) => (
                            <List.Item key={student.id}>
                                <button className="wrapper-enlight" onClick={() => { setStudentInfo(student); setApplicationId(student.application_id); setIsOpen(true) }} onKeyDown={() => { }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={<img src="https://i.imgur.com/QVI00J0.jpeg" alt="avatar" />} size="large" />}
                                        style={{ padding: ".5%" }}
                                        title={student.surname + " " + student.name}
                                        description={<div style={{ textAlign: "left", marginTop: "-3px" }}>{student.id}</div>}
                                    />
                                    <Flex wrap="wrap" gap="small" style={{ padding: ".5%", alignItems: 'center' }}>
                                        <Tooltip title="Accept Application">
                                            <Button ghost type="primary"
                                                loading={buttonsLoading}
                                                disabled={buttonsLoading}
                                                icon={<CheckOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showModal(
                                                        <div>
                                                            <Paragraph>
                                                                <Text strong>
                                                                    Are you sure you want to accept this application?
                                                                </Text>
                                                            </Paragraph>
                                                            <Paragraph>
                                                                <Text strong>Thesis title: </Text><Text>{x.title}</Text>
                                                                <br />
                                                                <Text strong>Student: </Text><Text>{student.name + " " + student.surname}</Text>
                                                            </Paragraph>
                                                        </div>,
                                                        () => acceptApplication(x.id, student),
                                                        "Yes, accept the application",
                                                        "Cancel"
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Reject Application">
                                            <Button ghost danger
                                                loading={buttonsLoading}
                                                disabled={buttonsLoading}
                                                icon={<CloseOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showModal(
                                                        <div>
                                                            <Paragraph>
                                                                <Text strong>
                                                                    Are you sure you want to reject this application?
                                                                </Text>
                                                            </Paragraph>
                                                            <Paragraph>
                                                                <Text strong>Thesis title: </Text><Text>{x.title}</Text>
                                                                <br />
                                                                <Text strong>Student: </Text><Text>{student.name + " " + student.surname}</Text>
                                                            </Paragraph>
                                                        </div>,
                                                        () => rejectApplication(x.id, student),
                                                        "Yes, reject the application",
                                                        "Cancel"
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                    </Flex>
                                </button>
                            </List.Item>
                        )}
                    />
                </div>
            </div >
        ))
        return ApplicationList;
    }

    return (
        data.length > 0 ?
            <>
                <Alert message="To view a specific applicant's CV and eventually the file uploaded within the application, simply click anywhere in the corresponding row. Also, to view the Thesis Proposal just click on its title." type="info" showIcon closable />
                {isOpen && <StudentCV isOpen={isOpen} setIsOpen={setIsOpen} studentInfo={studentInfo} applicationId={applicationId} />}
                <ApplicationsList />
            </>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No applications pending..</Title>
            </div>
    )
}

export default TeacherApplications;