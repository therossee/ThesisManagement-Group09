import { React, useState, useEffect } from "react";
import API from "../API";
import { Alert, message, Divider, List, Skeleton, Avatar, Button, Flex, Typography, Tooltip } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
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

    const { Title } = Typography;

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
        let ApplicationList = data.map((x) => (
            <div key={x.id} >
                <Skeleton loading={isLoading} active title={false}>
                    <Divider orientation="center">
                        <div style={{ whiteSpace: "normal" }}>
                            <Title level={4} style={{ margin: "0" }}>
                                {x.title}
                            </Title>
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
                                <a className="wrapper-enlight" onClick={() => {setStudentInfo(student); setIsOpen(true) }} onKeyDown={()=>{}} >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    style={{padding: ".5%"}}
                                    title={student.surname + " " + student.name}
                                />
                                <Flex wrap="wrap" gap="small" style={{padding: ".5%"}}>
                                    <Tooltip title="Accept Application">
                                        <Button ghost type="primary"
                                            loading={buttonsLoading}
                                            disabled={buttonsLoading}
                                            icon={<CheckOutlined />}
                                            onClick={(e) => { e.stopPropagation(); acceptApplication(x.id, student) }} />
                                    </Tooltip>
                                    <Tooltip title="Reject Application">
                                        <Button ghost danger
                                            loading={buttonsLoading}
                                            disabled={buttonsLoading}
                                            icon={<CloseOutlined />}
                                            onClick={(e) => { e.stopPropagation(); rejectApplication(x.id, student) }} />
                                    </Tooltip>
                                </Flex>
                                </a>
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
                <Alert message="To view a specific applicant's CV and eventually the file uploaded within the application, simply click anywhere in the corresponding row." type="info" showIcon closable />
                {isOpen && <StudentCV isOpen={isOpen} setIsOpen={setIsOpen} studentInfo={studentInfo} />}
                <ApplicationsList />
            </>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No applications pending..</Title>
            </div>
    )
}


export default TeacherApplications;