import React, { useState, useEffect } from 'react';
import { message, Spin, Tooltip, FloatButton } from 'antd';
import { Form, Button, AutoCenter } from 'antd-mobile'
import dayjs from 'dayjs';
import { MobReview } from './insert_proposal_components/MobReview.jsx';
import { MobResult } from './insert_proposal_components/MobResult.jsx';
import { MobInsertBody } from './insert_proposal_components/MobInsertBody.jsx';
import API from '../API.jsx';
import {useParams} from "react-router-dom";

function MobInsertThesisProposal() {


  const [keywords, setKeywords] = useState([]);
  const [intCoSupervisors, setIntCoSupervisors] = useState([]);
  const [extCoSupervisors, setExtCoSupervisors] = useState([]);
  const [error, setError] = useState(-1);
  const [insert, setInsert] = useState(false);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const copyId = useParams().id;
  const [formData, setFormData] = useState(null);
  const [form] = Form.useForm();
  const [proposalId, setProposalId] = useState(-1);
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    if (copyId) {
      API.getThesisProposalbyId(copyId)
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
              expirationDate: new Date(x.expiration),
              cds: x.cds.map((x) => x.cod_degree),
              degreeLevel: x.level
            }
            form.setFieldsValue(proposal);
            setFormData(proposal);
          })
          .catch((err) => {
            message.error(err.message ? err.message : err);
          })
          .finally(() => {
            setTimeout(() => {
              setLoading(false);
            }, 200);
          });
    }
  }, []);


  useEffect(() => {
    API.getTeachers()
      .then((obj) => {
        setIntCoSupervisors(obj.teachers);
      })
      .catch((err) => {
        message.error("Failed to fetch teachers!" + err.message ? err.message : err);
      });
    API.getExtCoSupervisors()
      .then((obj) => {
        setExtCoSupervisors(obj.externalCoSupervisors);
      })
      .catch((err) => {
        message.error("Failed to fetch external co-supervisors!" + err.message ? err.message : err);
      });
    API.getAllDegrees()
      .then((obj) => {
        setDegrees(obj);
      })
      .catch((err) => {
        message.error("Failed to fetch degrees!" + err.message ? err.message : err);
      });
    API.getAllKeywords()
      .then((obj) => {
        setKeywords(obj.keywords);
      })
      .catch((err) => {
        message.error("Failed to fetch keywords!" + err.message ? err.message : err);
      });
    API.getClock()
      .then((clock) => {
        setDate(dayjs().add(clock.offset, 'ms'));
      })
      .catch((err) => {
        message.error("Failed to fetch virtual clock!" + err.message ? err.message : err);
      })
        .finally(() => {
          if(!copyId) {
            setLoading(false);
          }
        });
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
        expiration: dayjs(formData.expirationDate).format("YYYY-MM-DD"),
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
        <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%", marginBottom: "85px" }}>
          <Spin tip="Loading" size="large" />
        </div>
        :
        <>
          <div style={{ marginRight: "2%", marginTop: "3%" }}>
            <div>
              {current === 0 && (
                <>
                  <div>
                    <h2>Insert Body</h2>
                  </div>
                  <MobInsertBody saveData={saveFormData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} keywords={keywords} degrees={degrees} form={form} date={date} />
                </>
              )}
              {current === 1 && (
                <div style={{ marginLeft: "10%" }}>
                  <MobReview formData={formData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} degrees={degrees} />
                  <div style={{paddingBottom: "60px" }}>
                    <AutoCenter>
                    <Button
                      style={{
                        margin: "0 8px",
                        marginTop: "3%",
                      }}
                      onClick={() => prev()}
                    >
                      Previous
                    </Button>
                    <Button type="primary" onClick={addProposal} style={{
                      margin: "0 8px",
                      marginTop: "3%",
                    }}>
                      Next
                    </Button>
                    </AutoCenter>
                  </div>
                </div>
              )}
            </div>
            <div>
              {current === 2 &&
                <MobResult update={false} proposalId={proposalId} error={error} />
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

export default MobInsertThesisProposal;