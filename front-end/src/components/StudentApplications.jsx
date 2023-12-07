import { React, useState, useEffect } from "react";
import { Space, Badge, Button, Skeleton, message, Typography, Tooltip, FloatButton, Timeline } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import { useAuth } from "./authentication/useAuth";
import API from "../API";

function StudentApplications() {

    const { accessToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [dirty, setDirty] = useState(true);
    const [data, setData] = useState([]);

    const { Title } = Typography;

    useEffect(() => {
        if (accessToken) {
            const fetchData = async () => {
                try {
                    if (dirty) {
                        setIsLoading(true);
                        const proposals = await API.getStudentApplicationsHistory(accessToken);
                        setData(proposals);
                        setIsLoading(false);
                        setDirty(false);
                    }
                } catch (err) {
                    message.error(err.message ? err.message : err);
                    setIsLoading(false);
                    setDirty(false);
                }
            };
            fetchData();
        }
    }, [dirty, accessToken]);


    const items = data.map((x, index) => ({
        children: (
            <div key={index} style={{ marginBottom: '10px' }}>
                <Title level={5} style={{ margin: "0" }}>{x.title}</Title>
                <MyBadge text={x.status} />
            </div>
        ),
        color: (getColor(x.status))
    }));

    function getColor(x) {
        let color = "";
        switch (x) {
            case 'waiting for approval':
                color = "blue";
                break;
            case 'accepted':
                color = "green";
                break;
            case 'rejected':
                color = "red";
                break;
            default:
                color = "grey";
        }
        return color;
    }

    return (
        <>
            <Button type="link" icon={<ReloadOutlined />} loading={dirty} disabled={dirty} onClick={() => (setDirty(true))}>Refresh List</Button>
            {isLoading ?
                <Skeleton active />
                :
                data.length > 0 ?
                    <Timeline reverse={true} mode="alternate" items={items} style={{ marginTop: "15px" }} />
                    :
                    <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
                        <Title level={4} >No application requests found.</Title>
                    </Space>}
            <Tooltip title="Back to Top">
                <FloatButton.BackTop style={{ marginBottom: "40px" }} >
                </FloatButton.BackTop>
            </Tooltip>
        </>
    );
}

function MyBadge(props) {

    let status = "";

    switch (props.text) {
        case 'waiting for approval':
            status = "processing";
            break;
        case 'accepted':
            status = "success";
            break;
        case 'rejected':
            status = "error";
            break;
        default:
            status = "default";
    }

    return (
        <Badge status={status} text={props.text} />
    )
}

export default StudentApplications;