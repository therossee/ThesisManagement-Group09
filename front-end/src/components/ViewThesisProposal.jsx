import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Descriptions, Skeleton, Typography, Tag, message } from "antd";
import dayjs from 'dayjs';
import API from "../API";


function ViewThesisProposal(props) {

  const { isTeacher } = props.isTeacher;
  const { isAuthenticated } = props.isAuthenticated;

  const { id } = useParams();
  const { Text } = Typography;
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Storing all Thesis Proposal Information
  const [data, setData] = useState();

  const applyForProposal = () => {
    setLoading(true);
    addApplication();
  }

  async function addApplication() {
    try {
      await API.applyForProposal(props.accessToken, id);
      message.success("Applied for proposal");
      setDisabled(true);
      setLoading(false);
    } catch (err) {
      message.error(err.message ? err.message : err);
      setDisabled(false);
      setLoading(false);
    }
  }


  useEffect(() => {
    API.getThesisProposalbyId(props.accessToken, id)
      .then((x) => {
        setData(x);

        API.getClock()
          .then((y) => {
            const actual = dayjs().add(y.offset, 'ms')
            const expDate = dayjs(x.expiration);
            expDate.isBefore(actual) ? setDisabled(true) : setDisabled(false);
          })
          .catch((err) => { message.error(err.message ? err.message : err) });
      })
      .catch((err) => { message.error(err.message ? err.message : err) })
  }, []);

  // Another Useffect needed because isTeacher needs time to be computed. It is initialized as undefined so we can actually check when it is computed.
  useEffect(() => {
    // Exclude teachers from Application fetch
    // Explanation: If ((isTeacher is computed and user is not a teacher) or (user is logged in and not a teacher (even if not yet computed)))
    if ((isTeacher !== undefined && !isTeacher) || (isAuthenticated && !isTeacher)) {
      API.getStudentActiveApplication(props.accessToken)
        .then((x) => {
          if (x.length > 0)
            // Disabled if there's already an application pending
            setDisabled(true);
        })
        .catch((err) => { message.error(err.message ? err.message : err) });
    }
  }, [data, isTeacher, isAuthenticated]);

  // If data is still empty
  if (!data) {
    return <Skeleton active />;
  }

  // Description fields
  const items = [
    {
      key: '1',
      label: 'Level',
      span: 1,
      children: <Text copyable>{data.level}</Text>
    },
    {
      key: '2',
      label: 'Type',
      span: 1,
      children: <Text copyable>{data.type}</Text>
    },
    {
      key: '3',
      label: 'Expiration Date',
      span: 1,
      children: <Text copyable>{data.expiration}</Text>
    },
    {
      key: '4',
      label: 'Description',
      span: 3,
      children: <Text copyable>{data.description}</Text>
    },
    data.requiredKnowledge
      ? {
        key: '5',
        label: 'Required Knowledge',
        span: 3,
        children: <Text copyable>{data.requiredKnowledge}</Text>
      }
      :
      undefined,
    {
      key: '6',
      label: 'Supervisor',
      span: 3,
      children: <Tag color="blue">{data.supervisor.name + " " + data.supervisor.surname}</Tag>
    },
    (data.internalCoSupervisors.length !== 0 || data.externalCoSupervisors.length !== 0)
      ? {
        key: '7',
        label: 'Co-Supervisors',
        span: 3,
        children:
          [].concat(data.internalCoSupervisors, data.externalCoSupervisors)
            .map((x, index, array) => (
              x.name + " " + x.surname + `${index !== array.length - 1 ? ", " : ""}`
            ))
      }
      :
      undefined,
    {
      key: '8',
      label: 'Groups',
      span: 3,
      children:
        data.groups.map((x, index, array) => (
          x + `${index !== array.length - 1 ? ", " : ""}`
        ))
    },
    data.notes
      ? {
        key: '9',
        label: 'Notes',
        span: 3,
        children:
          <Text copyable>
            {data.notes}
          </Text>
      }
      :
      undefined,
    {
      key: '10',
      label: 'Keywords',
      span: 3,
      children:
        data.keywords.map((x, index, array) => (
          x + `${index !== array.length - 1 ? ", " : ""}`
        ))
    },
    isTeacher
      ? {
        key: '11',
        label: 'CdS',
        span: 3,
        children:
          data.cds.map((x, index, array) => (
            x.title_degree + `${index !== array.length - 1 ? ", " : ""}`
          ))
      }
      :
      undefined
  ].filter(item => item !== undefined); // exclude some field for student view (without rendering useless whitespace)

  return (
    <>
      <Button type="link" onClick={() => navigate("/proposals")}>&lt; Back to Thesis Proposals</Button>
      <div style={{ paddingLeft: "2%", marginRight: "2%" }}>
        <Descriptions title={data.title} layout="vertical" items={items} />
        {!isTeacher && <Button ghost type="primary" disabled={disabled} loading={loading} onClick={applyForProposal}>Apply for proposal</Button>}
      </div>
    </>
  )
}

export { ViewThesisProposal };