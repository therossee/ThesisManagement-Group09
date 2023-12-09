import { React, useState, useEffect } from "react";
import API from "../API";
import { useAuth } from "./authentication/useAuth";
import { message, Divider, List, Skeleton, Avatar, Button, Flex, Typography, Tooltip } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

function TeacherApplications() {

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

    const acceptApplication = async (proposalId, studentId) => {
        setButtonsLoading(true);
        try {
            await API.acceptThesisApplications(proposalId, studentId);
            message.success("Successfully accepted the application of " + studentId);
            setDirty(true);
            setButtonsLoading(false)
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonsLoading(false);
        }
    };


    const rejectApplication = async (proposalId, studentId) => {
        setButtonsLoading(true);
        try {
            await API.rejectThesisApplications(proposalId, studentId);
            message.success("Successfully rejected the application of " + studentId);
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
                <List
                    loading={isLoading}
                    itemLayout="horizontal"
                    dataSource={x.applications}
                    renderItem={(student) => (
                        <div style={{ marginRight: "20%", marginLeft: "20%" }}>
                            <List.Item key={student.id}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={`${student.surname} ${student.name}`}
                                />
                                <Flex wrap="wrap" gap="small">
                                    <Tooltip title="Accept Application">
                                        <Button loading={buttonsLoading} disabled={buttonsLoading} icon={<CheckOutlined />} onClick={() => acceptApplication(x.id, student.id)} ghost type="primary" />
                                    </Tooltip>
                                    <Tooltip title="Reject Application">
                                        <Button loading={buttonsLoading} disabled={buttonsLoading} icon={<CloseOutlined />} onClick={() => rejectApplication(x.id, student.id)} danger />
                                    </Tooltip>
                                </Flex>
                            </List.Item>
                        </div>
                    )}
                />
            </div>

        ))
        return ApplicationList;
    }

    return (
        data.length > 0 ?
            <ApplicationsList />
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No applications pending..</Title>
            </div>
    )
}


export default TeacherApplications;