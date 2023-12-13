import { React, useState, useEffect } from "react";
import { Space, Badge, Button, Skeleton, message, Typography, Tooltip, FloatButton, Timeline } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import API from "../API";

function StudentApplications() {

    const [isLoading, setIsLoading] = useState(true);
    const [dirty, setDirty] = useState(true);
    const [data, setData] = useState([]);

    const { Title } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dirty) {
                    setIsLoading(true);
                    const proposals = await API.getStudentApplicationsHistory();
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
    }, [dirty]);


    const items = data.map((x, index) => ({
        children: (
            <div key={x.application_id} style={{ marginBottom: '10px' }}>
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

    let content;
    if(isLoading){
        content = <Skeleton active/>
    }else if (data.length > 0){
        content = <Timeline reverse={true} mode="alternate" items={items} style={{ marginTop: "15px" }} />
    }else{
        content = (
        <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
            <Title level={4} >No application requests found.</Title>
        </Space>
        );
    }

    return (
        <>
            <Button type="link" icon={<ReloadOutlined />} loading={dirty} disabled={dirty} onClick={() => (setDirty(true))}>Refresh List</Button>
            {content}
            <Tooltip title="Back to Top">
                <FloatButton.BackTop style={{ marginBottom: "40px" }} />
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

MyBadge.propTypes = {
    text: PropTypes.string.isRequired,
};

export default StudentApplications;