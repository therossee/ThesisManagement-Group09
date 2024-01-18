import { useState, useEffect } from 'react';
import { Alert, Button, Badge, Tabs, Input, message } from 'antd';
import { CheckOutlined, HistoryOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Collapse, Modal } from 'antd-mobile';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { renderTeacherInfo } from './MobStudentThesisStartRequest';
import PropTypes from 'prop-types';
import API from '../API';

dayjs.extend(localizedFormat);

function TeacherThesisStartRequest() {

    const [refresh, setRefresh] = useState(true);

    const [loadData, setLoadData] = useState(false);

    const [requestsArray, setRequestsArray] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (refresh) {
                    setLoadData(true);
                    const tsr = await API.getTeacherThesisStartRequest();
                    setRequestsArray(tsr);
                }
            } catch (err) {
                message.error(err.message ? err.message : err);
            }
            finally {
                setLoadData(false);
                setRefresh(false);
            }
        };
        fetchData();
    }, [refresh]);



    return (
            <div style={{ paddingBottom: '70px' }}>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    onChange={() => setRefresh(true)}
                    style={{ height: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: <span><CheckOutlined />Pending Request</span>,
                            children: <PendingRequests tsr={requestsArray} setDirty={setRefresh}/>,
                        },
                        {
                            key: '2',
                            label: <span><HistoryOutlined />Decisions History</span>,
                            children: <HistoryRequests tsr={requestsArray} />,
                        },
                    ]}
                />
            </div>
    )
}

const coSupComponents = (tsr) => {
    if (tsr.co_supervisors.length > 0) {
        return tsr.co_supervisors.map((cSv, index) => {
            return (
                <div key={cSv.id}>
                    <h3>Co-Supervisor #{index + 1}: </h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {renderTeacherInfo(cSv.name, cSv.surname)}
                        <span> - </span>
                        <p style={{ margin: 5 }}>ID: {cSv.id}</p>
                    </div>
                </div>
            );
        });
    }
}

function PendingRequests({ tsr, setDirty }) {

    const [requestedChanges, setRequestedChanges] = useState('');

    const reviewRequest = (selected, requestedChanges) => {
        try {
            API.reviewThesisStartRequest(selected.id, requestedChanges);
            message.success("Successfully requested changes for " + selected.student.surname + " " + selected.student.name + "'s request");
            setRefresh(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
        }
    };

    const showModal = (content, action, okText, cancelText) => {
        Modal.confirm({
            title: "Confirm action",
            icon: <ExclamationCircleFilled />,
            content: (
                <div>
                    {content}
                    <h3>Requested changes: </h3>
                    <Input.TextArea rows={4} value={requestedChanges} onChange={(e) => setRequestedChanges(e.target.value)} />
                </div>
            ),
            onConfirm: action,
            confirmText: okText,
            cancelText: cancelText,
        });
    };

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
            <Collapse accordion>
                {tsr.map((startRq) => ((startRq.status === 'accepted by secretary' || startRq.status === 'changes requested') &&
                    <Collapse.Panel key={startRq.id} title={startRq.title}>
                        <h3>Submitted on: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {dayjs(startRq.creation_date).format('LLL')}
                        </div>
                        <h3>Student: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {renderTeacherInfo(startRq.student.name, startRq.student.surname)}
                            <span> - </span>
                            <p style={{ margin: 5 }}>ID: {startRq.student.id}</p>
                        </div>
                        <h3>Status: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getStatus(startRq.status)}
                        </div>
                        <h3>Approval date: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {startRq.approval_date ? dayjs(startRq.approval_date).format('LLL') : "Not yet approved"}
                        </div>
                        <h3>Description: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {startRq.description}
                        </div>
                        {startRq.co_supervisors.length > 0 ? coSupComponents(startRq) : <></>}
                        <Button onClick={() => showModal("Are you sure you want to request changes?", () => reviewRequest(startRq, requestedChanges), "Confirm", "Cancel")}>Request changes</Button>
                        <Button onClick={() => showModalAccRej("Are you sure you want to accept this request?", () => acceptTsr(startRq.id, startRq.student.id), "Confirm action", "Cancel")}>Accept</Button>
                        <Button onClick={() => showModalAccRej("Are you sure you want to reject this request?", () => rejectTsr(startRq.id, startRq.student.id), "Confirm action", "Cancel")}>Reject</Button>
                    </Collapse.Panel>
                ))}
            </Collapse>
        );
    }
    else
        return <Alert message="Good job, it seems like there is no pending request!" type="info" showIcon closable />
}

function HistoryRequests({ tsr }) {

    if (tsr.some(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')) {
        return (
            <Collapse accordion>
                {tsr.map((thesisStartRequest) => ((thesisStartRequest.status === 'accepted by teacher' || thesisStartRequest.status === 'rejected by teacher') &&
                    <Collapse.Panel key={thesisStartRequest.id} title={thesisStartRequest.title}>
                        <h3>Submitted on: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {dayjs(thesisStartRequest.creation_date).format('LLL')}
                        </div>
                        <h3>Student: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {renderTeacherInfo(thesisStartRequest.student.name, thesisStartRequest.student.surname)}
                            <span> - </span>
                            <p style={{ margin: 5 }}>ID: {thesisStartRequest.student.id}</p>
                        </div>
                        <h3>Status: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getStatus(thesisStartRequest.status)}
                        </div>
                        <h3>Approval date: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {thesisStartRequest.approval_date ? dayjs(thesisStartRequest.approval_date).format('LLL') : "Not yet approved"}
                        </div>
                        <h3>Description: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {thesisStartRequest.description}
                        </div>
                        {thesisStartRequest.co_supervisors.length > 0 ? coSupComponents(thesisStartRequest) : <></>}
                    </Collapse.Panel>
                ))}
            </Collapse>
        )
    }
    else
        return <Alert message="It seems like there is nothing to show here..." type="info" showIcon closable />
}

function getStatus(status) {
    switch (status) {
        case "accepted by secretary":
            return <Badge status="processing" text={<strong>Waiting for your approval</strong>} />;
        case "changes requested":
            return <Badge status="warning" text={<strong>Changes requested</strong>} />;
        case "rejected by teacher":
            return <Badge status="error" text={<strong>Rejected by you</strong>} />;
        case "accepted by teacher":
            return <Badge status="success" text={<strong>Accepted by you</strong>} />;
        default:
            return <Badge status="error" text={<strong>Failed fetching/parsing information</strong>} />
    }
}

const showModalAccRej = (content, action, okText, cancelText) => {
    Modal.confirm({
        title: "Confirm action",
        icon: <ExclamationCircleFilled />,
        content: content,
        onConfirm: action,
        confirmText: okText,
        cancelText: cancelText,
    });
};


PendingRequests.propTypes = {
    tsr: PropTypes.array.isRequired,
    setDirty: PropTypes.func.isRequired,
};

HistoryRequests.propTypes = {
    tsr: PropTypes.array.isRequired,
};


export default TeacherThesisStartRequest;