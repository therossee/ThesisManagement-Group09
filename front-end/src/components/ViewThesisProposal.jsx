import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Descriptions, Modal, Skeleton, Typography, Tag, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../components/authentication/useAuth';
import dayjs from 'dayjs';
import API from "../API";


function ViewThesisProposal() {

  const { isTeacher } = useAuth();

  const { id } = useParams();
  const { Text } = Typography;
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handling Modal open status
  const [isOpen, setIsOpen] = useState(false);

  // Storing all Thesis Proposal Information
  const [data, setData] = useState();

  const applyForProposal = () => {
    setLoading(true);
    addApplication();
  }

  async function addApplication() {
    try {
      await API.applyForProposal(id,);
      message.success("Succesfully applied");
      setDisabled(true);
      setLoading(false);
    } catch (err) {
      message.error(err.message ? err.message : err);
      setDisabled(false);
      setLoading(false);
    }
  }


  useEffect(() => {
    API.getThesisProposalbyId(id)
      .then((x) => {
        setData(x);

        API.getClock()
          .then((y) => {
            const actual = dayjs().add(y.offset, 'ms')
            const expDate = dayjs(x.expiration);
            if (expDate.isBefore(actual)) {
              setDisabled(true);
            }
          })
          .catch((err) => { message.error(err.message ? err.message : err) });
      })
      .catch((err) => { message.error(err.message ? err.message : err) })
  }, []);

  // Another Useffect needed because isTeacher needs time to be computed. It is initialized as undefined so we can actually see when it is computed by checking isTeacher===false and not !isTeacher.
  useEffect(() => {
    // Exclude teachers from Active Application fetch
    if ((isTeacher === false)) {
      API.getStudentActiveApplication()
        .then((x) => {
          if (x.length > 0)
            // Disabled if there's already an application pending
            setDisabled(true);
        })
        .catch((err) => { message.error(err.message ? err.message : err) });
    }
  }, [isTeacher]);

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

  function MyModal() {

  // Handling file uplaoded
  const [uploadedFile, setUploadedFile] = useState(null);

    const beforeUpload = file => {
      let isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('You can only upload PDF files!');
      }
      return isPDF;
    };

    const onChange = info => {
      // Check if the user uploaded a new file
      if (info.file.status === 'done' && info.file.originFileObj !== uploadedFile) {
        // Remove the last uploaded file from the list
        setUploadedFile(info.file.originFileObj);
        message.success(`${info.file.name} uploaded successfully.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    }

    return (
      <Modal title="Application"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" type="primary" danger onClick={() => setIsOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={(<></>)}>Send</Button>
        ]}
      >
        <Upload.Dragger
          beforeUpload={beforeUpload}
          onChange={onChange}
          action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
          multiple={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Only one PDF file allowed!</p>
        </Upload.Dragger>
      </Modal>
    )
  }

  return (
    <>
      <MyModal />
      <Button type="link" onClick={() => navigate("/proposals")}>&lt; Back to Thesis Proposals</Button>
      <div style={{ paddingLeft: "2%", marginRight: "2%" }}>
        <Descriptions title={data.title} layout="vertical" items={items} />
        {!isTeacher && <Button ghost type="primary" disabled={disabled} loading={loading} onClick={() => setIsOpen(true)}>Apply for proposal</Button>}
      </div>
    </>
  )
}

export { ViewThesisProposal };