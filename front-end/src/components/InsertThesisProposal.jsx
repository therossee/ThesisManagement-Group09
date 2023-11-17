import React, { useState, useEffect } from 'react';
import { Form, message, Spin, Steps, Tooltip, FloatButton, Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { ReviewProposal } from './insert_proposal_components/ReviewProposal.jsx';
import { UploadResult } from './insert_proposal_components/UploadResult.jsx';
import { InsertBody } from './insert_proposal_components/InsertBody.jsx';
import API from '../API.jsx';

const steps = [
    {
      title: "Insert Thesis Proposal",
      content: <InsertBody />,
    },
    {
      title: "Review Proposal",
      content: <ReviewProposal />,
    },
    {
      title: "Upload",
      content: <UploadResult />,
    },
  ];

const { Title } = Typography;

function InsertThesisProposal() {

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
          setLoading(false);
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
        API.insertProposal(proposal)
          .then((obj) => {
            setProposalId(obj.id);
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
                  <UploadResult proposalId={proposalId} error={error} />
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

  export { InsertThesisProposal }