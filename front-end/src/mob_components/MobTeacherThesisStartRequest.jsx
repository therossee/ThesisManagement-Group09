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

    const [dirty, setDirty] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [tsr, setTsr] = useState([]);


    const reviewTsr = (selected, requestedChanges) => {
        try {
            API.reviewThesisStartRequest(selected.id, requestedChanges);
            message.success("Successfully requested changes for " + selected.student.surname + " " + selected.student.name + "'s request");
            setDirty(true);
            setRequestedChanges("");
        } catch (err) {
            message.error(err.message ? err.message : err);
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
                message.error(err.message ? err.message : err);
            }
            finally {
                setIsLoading(false);
                setDirty(false);
            }
        };
        fetchData();
    }, [dirty]);



    return (

        <>
            <div style={{ paddingBottom: '70px' }}>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    onChange={() => setDirty(true)}
                    style={{ height: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: <span><CheckOutlined />Pending Request</span>,
                            children: <PendingThesisStartRequest tsr={tsr} isLoading={isLoading} setDirty={setDirty}
                            reviewTsr={reviewTsr}/>,
                        },
                        {
                            key: '2',
                            label: <span><HistoryOutlined />Decisions History</span>,
                            children: <HistoryThesisStartRequest tsr={tsr} isLoading={isLoading} />,
                        },
                    ]}
                />
            </div>
        </>
    )
}

const coSupComponents = (tsr) => {
    if (tsr.co_supervisors.length > 0) {
        return tsr.co_supervisors.map((cSv, index) => {
            return (
                <div key={index}>
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

function PendingThesisStartRequest({ tsr, setDirty }) {

    const [requestedChanges, setRequestedChanges] = useState('');

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
                {tsr.map((x) => ((x.status === 'accepted by secretary' || x.status === 'changes requested') &&
                    <Collapse.Panel key={x.id} title={x.title}>
                        <h3>Submitted on: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {dayjs(x.creation_date).format('LLL')}
                        </div>
                        <h3>Student: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {renderTeacherInfo(x.student.name, x.student.surname)}
                            <span> - </span>
                            <p style={{ margin: 5 }}>ID: {x.student.id}</p>
                        </div>
                        <h3>Status: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getStatus(x.status)}
                        </div>
                        <h3>Approval date: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {x.approval_date ? dayjs(x.approval_date).format('LLL') : "Not yet approved"}
                        </div>
                        <h3>Description: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {x.description}
                        </div>
                        {x.co_supervisors.length > 0 ? coSupComponents(x) : <></>}
                        <Button onClick={() => showModal("Are you sure you want to request changes?", () => reviewTsr(x, requestedChanges), "Confirm", "Cancel")}>Request changes</Button>
                        <Button onClick={() => showModalAccRej("Are you sure you want to accept this request?", () => acceptTsr(x.id, x.student.id), "Confirm action", "Cancel")}>Accept</Button>
                        <Button onClick={() => showModalAccRej("Are you sure you want to reject this request?", () => rejectTsr(x.id, x.student.id), "Confirm action", "Cancel")}>Reject</Button>
                    </Collapse.Panel>
                ))}
            </Collapse>
        );
    }
    else
        return <Alert message="Good job, it seems like there is no pending request!" type="info" showIcon closable />
}

function HistoryThesisStartRequest({ tsr }) {

    if (tsr.some(tsr => tsr.status === 'accepted by teacher' || tsr.status === 'rejected by teacher')) {
        return (
            <Collapse accordion>
                {tsr.map((x) => ((x.status === 'accepted by teacher' || x.status === 'rejected by teacher') &&
                    <Collapse.Panel key={x.id} title={x.title}>
                        <h3>Submitted on: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {dayjs(x.creation_date).format('LLL')}
                        </div>
                        <h3>Student: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {renderTeacherInfo(x.student.name, x.student.surname)}
                            <span> - </span>
                            <p style={{ margin: 5 }}>ID: {x.student.id}</p>
                        </div>
                        <h3>Status: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getStatus(x.status)}
                        </div>
                        <h3>Approval date: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {x.approval_date ? dayjs(x.approval_date).format('LLL') : "Not yet approved"}
                        </div>
                        <h3>Description: </h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {x.description}
                        </div>
                        {x.co_supervisors.length > 0 ? coSupComponents(x) : <></>}
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


PendingThesisStartRequest.propTypes = {
    tsr: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setDirty: PropTypes.func.isRequired,
    reviewTsr: PropTypes.func.isRequired,
};

HistoryThesisStartRequest.propTypes = {
    tsr: PropTypes.array.isRequired,
};


export default TeacherThesisStartRequest;