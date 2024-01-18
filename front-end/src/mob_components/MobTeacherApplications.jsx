import { useState, useEffect } from "react";
import API from "../API";
import { Button, Alert, message, Divider, List, Skeleton, Avatar, Flex, Typography, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import MobCV from "../mob_components/MobCV";

function MobTeacherApplications() {

    // List of objects for storing thesis info and applications
    const [appData, setAppData] = useState([]);

    const [loadData, setLoadData] = useState(false);

    const [loadButtons, setLoadButtons] = useState(false);

    const [refresh, setRefresh] = useState(true);

    // Which student should be seen in the drawer?
    const [studInfo, setStudInfo] = useState(null);

    const [appId, setAppId] = useState(-1);

    const [tab, setTab] = useState("list");

    const { Title } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (refresh) {
                    setLoadData(true);
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
                    setAppData(newData);
                    setLoadData(false);
                    setRefresh(false);
                }
            } catch (err) {
                message.error(err.message ?? err);
            }
        };

        fetchData();
    }, [refresh]);

    const acceptApplication = async (proposalId, student) => {
        setLoadButtons(true);
        try {
            await API.acceptThesisApplications(proposalId, student.id);
            message.success("Accepted the application of " + student.surname + " " + student.name);
            setRefresh(true);
            setLoadButtons(false)
        } catch (err) {
            message.error(err.message ?? err);
            setLoadButtons(false);
        }
    };


    const rejectApplication = async (proposalId, student) => {
        setLoadButtons(true);
        try {
            await API.rejectThesisApplications(proposalId, student.id);
            message.success("Rejected the application of " + student.surname + " " + student.name);
            setRefresh(true);
            setLoadButtons(false);
        } catch (err) {
            message.error(err.message ?? err);
            setLoadButtons(false);
        }
    };

    function ApplicationsList() {
        let ApplicationList = appData.map((x) => (
            <div key={x.id} >
                <Skeleton loading={loadData} active title={false}>
                    <Divider orientation="center">
                        <div style={{ whiteSpace: "normal" }}>
                            <Title level={4} style={{ margin: "0" }}>
                                {x.title}
                            </Title>
                        </div>
                    </Divider>
                </Skeleton>
                <div style={{ marginRight: "5%", marginLeft: "5%" }}>
                    <List
                        loading={loadData}
                        itemLayout="horizontal"
                        dataSource={x.applications}
                        renderItem={(student) => (
                            <List.Item key={student.id}>
                                <div className="wrapper-enlight" onClick={() => { setStudInfo(student); setAppId(student.application_id); setTab("cv") }} onKeyDown={() => { }} role="button">
                                    <List.Item.Meta
                                        avatar={<Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />}
                                        style={{ padding: ".5%" }}
                                        title={student.surname + " " + student.name}
                                    />
                                    <Flex wrap="wrap" gap="small" style={{ padding: ".5%" }}>
                                        <Tooltip title="Accept Application">
                                            <Button ghost type="primary"
                                                loading={loadButtons}
                                                disabled={loadButtons}
                                                icon={<CheckOutlined />}
                                                onClick={(e) => { e.stopPropagation(); acceptApplication(x.id, student) }} />
                                        </Tooltip>
                                        <Tooltip title="Reject Application">
                                            <Button ghost danger
                                                loading={loadButtons}
                                                disabled={loadButtons}
                                                icon={<CloseOutlined />}
                                                onClick={(e) => { e.stopPropagation(); rejectApplication(x.id, student) }} />
                                        </Tooltip>
                                    </Flex>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </div >

        ))
        return ApplicationList;
    }

    return (
        appData.length > 0 ?
            <>
                {tab === "list" &&
                    <>
                <Alert message="To view a specific applicant's CV and eventually the file uploaded within the application, simply tap anywhere in the corresponding row." type="info" showIcon closable />
                <ApplicationsList />
                    </>
                }
                {tab === "cv" &&
                <MobCV studentInfo={studInfo} applicationId={appId} setTab={setTab} />
                }
            </>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={3}>No applications pending..</Title>
            </div>
    )
}


export default MobTeacherApplications;