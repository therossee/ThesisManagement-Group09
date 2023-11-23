import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Descriptions, Skeleton, Typography, Tag, message } from "antd";
import API from "../API";

function ViewThesisProposal() {

  const [messageApi, messageBox] = message.useMessage();

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
      await API.applyForProposal(id);
      messageApi.success("Applied for proposal");
      setDisabled(true);
      setLoading(false);
    } catch (err) {
      messageApi.error(err.message ? err.message : err);
      setDisabled(false);
      setLoading(false);
    }
  }


  useEffect(() => {
    API.getThesisProposalbyId(id)
      .then((x) => {
        setData(x);
        API.getStudentApplications()
          .then((z) => {
              if(x.status === "ACTIVE") {
                const dis = z.includes(parseInt(id));
                setDisabled(dis);
              }
          })
          .catch((err) => { messageApi.error(err.message ? err.message : err) });
      })
      .catch((err) => { messageApi.error(err.message ? err.message : err) })
  }, []);

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
    {
      key: '5',
      label: 'Required Knowledge',
      span: 3,
      children: <Text copyable>{data.requiredKnowledge}</Text>
    },
    {
      key: '6',
      label: 'Supervisor',
      span: 3,
      children: <Tag color="blue">{data.supervisor.name + " " + data.supervisor.surname}</Tag>
    },
    {
      key: '7',
      label: 'Co-Supervisors',
      span: 3,
      children:
        [].concat(data.internalCoSupervisors, data.externalCoSupervisors)
          .map((x, index, array) => (
            x.name + " " + x.surname + `${index !== array.length - 1 ? ", " : ""}`
          ))
    },
    {
      key: '8',
      label: 'Groups',
      span: 3,
      children:
        data.groups.map((x, index, array) => (
          x + `${index !== array.length - 1 ? ", " : ""}`
        ))
    },
    {
      key: '9',
      label: 'Notes',
      span: 3,
      children:
        <Text copyable>
          {data.notes}
        </Text>
    },
    {
      key: '10',
      label: 'Keywords',
      span: 3,
      children:
        data.keywords.map((x, index, array) => (
          x + `${index !== array.length - 1 ? ", " : ""}`
        ))
    }
  ];

  return (
    <>
      {messageBox}
      <Button type="link" onClick={() => navigate("/proposals")}>&lt; Back to Thesis Proposals</Button>
      <Descriptions title={data.title} layout="vertical" items={items} style={{ marginLeft: "2%", marginRight: "2%" }} />
      <div style={{ paddingLeft: "2%" }}>
        <Button type="primary" disabled={disabled} loading={loading} onClick={applyForProposal}>Apply for this proposal</Button>
      </div>
    </>
  )
}

export { ViewThesisProposal };