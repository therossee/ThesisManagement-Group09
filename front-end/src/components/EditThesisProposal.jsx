import React, { useState, useEffect } from 'react';
import { Form, message, Spin, Steps, Tooltip, FloatButton, Button } from 'antd';
import dayjs from 'dayjs';
import { ReviewProposal } from './insert_proposal_components/ReviewProposal.jsx';
import { useParams } from 'react-router-dom';
import { UploadResult } from './insert_proposal_components/UploadResult.jsx';
import { InsertBody } from './insert_proposal_components/InsertBody.jsx';
import API from '../API.jsx';

const steps = [
    {
        title: "Edit Proposal",
        content: <InsertBody />,
    },
    {
        title: "Review edited proposal",
        content: <ReviewProposal />,
    },
    {
        title: "Upload changes",
        content: <UploadResult />,
    },
];

function EditThesisProposal() {

    const id = useParams().id;
    const [keywords, setKeywords] = useState([]);
    const [intCoSupervisors, setIntCoSupervisors] = useState([]);
    const [extCoSupervisors, setExtCoSupervisors] = useState([]);
    const [error, setError] = useState(-1);
    const [insert, setInsert] = useState(false);
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState(null);
    const [form] = Form.useForm();
    const [proposalId, setProposalId] = useState(-1);
    const [messageApi, contextHolder] = message.useMessage();
    const [date, setDate] = useState(dayjs());


    useEffect(() => {
        API.getThesisProposalbyId(id)
            .then((x) => {
                let proposal;
                    proposal = {
                        title: x.title,
                        intCoSupervisors: x.internalCoSupervisors.map((x) => x.id),
                        extCoSupervisors: x.externalCoSupervisors.map((x) => x.id),
                        type: x.type,
                        description: x.description,
                        requiredKnowledge: x.requiredKnowledge,
                        notes: x.notes,
                        keywords: x.keywords,
                        expirationDate: dayjs(x.expiration),
                        cds: x.cds.map((x) => x.cod_degree),
                        degreeLevel: x.level
                    }
                form.setFieldsValue(proposal);
                setFormData(proposal);
            })
    }, []);

    useEffect(() => {
        API.getTeachers()
            .then((obj) => {
                setIntCoSupervisors(obj.teachers);
            })
            .catch((err) => {
                messageApi.error("Failed to fetch teachers!");
            });
        API.getExtCoSupervisors()
            .then((obj) => {
                setExtCoSupervisors(obj.externalCoSupervisors);
            })
            .catch((err) => {
                messageApi.error("Failed to fetch external co-supervisors!");
            });
        API.getAllDegrees()
            .then((obj) => {
                setDegrees(obj);
            })
            .catch((err) => {
                messageApi.error("Failed to fetch degrees!");
            });
        API.getAllKeywords()
            .then((obj) => {
                setKeywords(obj.keywords);
            })
            .catch((err) => {
                messageApi.error("Failed to fetch keywords!");
            });
        API.getClock()
            .then((clock) => {
                setDate(dayjs().add(clock.offset, 'ms'));
            })
            .catch((err) => {
                messageApi.error("Failed to fetch virtual clock!");
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 200);
            })
    }, [current]);

    useEffect(() => {
        if (insert) {
            const proposal = {
                title: formData.title,
                internal_co_supervisors_id: formData.intCoSupervisors ?? [],
                external_co_supervisors_id: formData.extCoSupervisors ?? [],
                type: formData.type,
                description: formData.description,
                required_knowledge: formData.requiredKnowledge,
                notes: formData.notes,
                keywords: formData.keywords,
                expiration: formData.expirationDate.format("YYYY-MM-DD"),
                cds: formData.cds,
                level: formData.degreeLevel
            }
            API.updateProposal(id, proposal)
                .then(() => {
                    setProposalId(id);
                    next();
                })
                .catch((err) => {
                    setProposalId(-1);
                    setError(err.status);
                    next();
                });
            setInsert(false);
        }
    }, [insert]);

    const addProposal = () => {
        setInsert(true);
    }

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const saveFormData = (data) => {
        setFormData(data);
        next();
    };

    return (
        <>
            {loading ?
                <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%" }}>
                    <Spin tip="Loading" size="large" />
                </div>
                :
                <>
                    {contextHolder}
                    <Steps
                        current={current}
                        items={items}
                        style={{ paddingRight: "20%", paddingLeft: "20%" }}
                    />
                    <div style={{ marginLeft: "16%", marginRight: "15%", marginTop: "3%" }}>
                        <div>
                            {current === 0 && (
                                <InsertBody saveData={saveFormData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} keywords={keywords} degrees={degrees} form={form} date={date} />
                            )}
                            {current === 1 && (
                                <div style={{ marginLeft: "10%" }}>
                                    <ReviewProposal formData={formData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} degrees={degrees} />
                                    <div style={{ paddingLeft: "35%" }}>
                                        <Button
                                            style={{
                                                margin: "0 8px",
                                                marginTop: "3%"
                                            }}
                                            onClick={() => prev()}
                                        >
                                            Previous
                                        </Button>
                                        <Button type="primary" onClick={addProposal} style={{
                                            margin: "0 8px",
                                            marginTop: "3%"
                                        }}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            {current === steps.length - 1 &&
                                <UploadResult update={true} proposalId={proposalId} error={error} />
                            }
                        </div>
                    </div>
                    <Tooltip title="Back to Top">
                        <FloatButton.BackTop style={{ marginBottom: "40px" }} >
                        </FloatButton.BackTop>
                    </Tooltip>
                </>
            }
        </>
    );
}

export { EditThesisProposal }