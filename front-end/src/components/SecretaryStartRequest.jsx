import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Alert, message, Divider, List, Skeleton, Avatar, Button, Flex, Typography, Tooltip, Modal } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
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
                    const newData = [];
                    const startRequests = await API.getSecretaryStartRequest();
                    startRequests.map((x) => {
                        newData.push(x);
                    })
                    setData(newData);
                    setIsLoading(false);
                    setDirty(false);
                    console.log(newData);
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
        let ApplicationList = data.map((x) => (
            <div key={x.id} >
                
                <Skeleton loading={isLoading} active title={false}>
                     
                    <Divider orientation="center">
                    {x.proposal_id?
                        <div style={{ whiteSpace: "normal" }}>
                            <Link to={`/view-proposal/${x.id}`}>
                                <Title level={4} style={{ margin: "0" }} >
                                    {x.title}
                                </Title>
                            </Link>
                        </div>
                        :
                        <div style={{ whiteSpace: "normal" }}>
                            <Title level={4} style={{ margin: "0" }} >
                                OTHER REQUESTS
                            </Title> 
                    </div>
                        }
                    </Divider> 
                </Skeleton>
                <div style={{ marginRight: "18%", marginLeft: "18%" }}>
                
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