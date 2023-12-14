import React, { useState, useEffect } from 'react';
import { message, Spin, Tooltip, FloatButton } from 'antd';
import { Form, Button } from 'antd-mobile'
import dayjs from 'dayjs';
import { MobReview } from './insert_proposal_components/MobReview.jsx';
import { MobResult } from './insert_proposal_components/MobResult.jsx';
import { useParams } from 'react-router-dom';
import { MobInsertBody } from './insert_proposal_components/MobInsertBody.jsx';
import API from '../API.jsx';

function MobEditThesisProposal() {

    const id = useParams().id;
    const [keywords, setKeywords] = useState([]);
    const [intCoSup, setIntCoSup] = useState([]);
    const [extCoSup, setExtCoSup] = useState([]);
    const [errCode, setErrCode] = useState(-1);
    const [insert, setInsert] = useState(false);
    const [degrees, setDegrees] = useState([]);
    const [loadData, setLoadData] = useState(true);
    const [curr, setCurr] = useState(0);
    const [formData, setFormData] = useState(null);
    const [form] = Form.useForm();
    const [proposalId, setProposalId] = useState(-1);
    const [date, setDate] = useState(new Date());


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
                    requiredKnowledge: x.requiredKnowledge ?? "",
                    notes: x.notes ?? "",
                    keywords: x.keywords,
                    expirationDate: dayjs(x.expiration).toDate(),
                    cds: x.cds.map((x) => x.cod_degree),
                    degreeLevel: x.level
                }
                setDate(dayjs(x.expiration).toDate());
                form.setFieldsValue(proposal);
                setFormData(proposal);
            })
    }, []);

    useEffect(() => {
        API.getTeachers()
            .then((obj) => {
                setIntCoSup(obj.teachers);
            })
            .catch((err) => {
                message.error("Failed to fetch teachers!" + err ? err.message : "");
            });
        API.getExtCoSupervisors()
            .then((obj) => {
                setExtCoSup(obj.externalCoSupervisors);
            })
            .catch((err) => {
                message.error("Failed to fetch external co-supervisors!" + err ? err.message : "");
            });
        API.getAllDegrees()
            .then((obj) => {
                setDegrees(obj);
            })
            .catch((err) => {
                message.error("Failed to fetch degrees!" + err ? err.message : "");
            });
        API.getAllKeywords()
            .then((obj) => {
                setKeywords(obj.keywords);
            })
            .catch((err) => {
                message.error("Failed to fetch keywords!" + err ? err.message : "");
            });
        API.getClock()
            .then((clock) => {
                setDate(dayjs().add(clock.offset, 'ms'));
            })
            .catch((err) => {
                message.error("Failed to fetch virtual clock!" + err ? err.message : "");
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadData(false);
                }, 200);
            })
    }, [curr]);

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
                expiration: dayjs(formData.expirationDate).format("YYYY-MM-DD"),
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
                    setErrCode(err.status);
                    next();
                });
            setInsert(false);
        }
    }, [insert]);

    const addProposal = () => {
        setInsert(true);
    };


    const next = () => {
        setCurr(curr + 1);
    };

    const prev = () => {
        setCurr(curr - 1);
    };

    const saveFormData = (data) => {
        setFormData(data);
        next();
    };

    return (
        <>
            {loadData ?
                <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%" }}>
                    <Spin tip="Loading" size="large" />
                </div>
                :
                <>
                    <div>
                        <div>
                            {curr === 0 && (
                                <>
                                    <div>
                                        <h2>Edit Body</h2>
                                    </div>
                                    <MobInsertBody saveData={saveFormData} intCoSupervisors={intCoSup} extCoSupervisors={extCoSup} keywords={keywords} degrees={degrees} form={form} date={date} />
                                </>
                            )}
                            {curr === 1 && (
                                <div>
                                    <MobReview formData={formData} intCoSupervisors={intCoSup} extCoSupervisors={extCoSup} degrees={degrees} />
                                    <div style={{ paddingLeft: "35%", paddingBottom: "60px" }}>
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
                            {curr === 2 &&
                                <MobResult update={true} proposalId={proposalId} error={errCode} />
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

export { MobEditThesisProposal }