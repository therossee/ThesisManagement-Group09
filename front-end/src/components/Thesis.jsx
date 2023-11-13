import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, FloatButton, Button, Form, Input, Select, Space, Steps, Table, Tag, Tooltip } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import API from "../API";

const { Option } = Select;

const OPTIONS_COSUPERVISORS = ["Apples", "Nails", "Bananas", "Helicopters"];

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
    content: <Done />,
  },
];

function InsertThesisProposal() {

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

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
      <Steps
        current={current}
        items={items}
        style={{ paddingRight: "20%", paddingLeft: "20%" }}
      />
      <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "3%" }}>
        <div>
          {current === 0 ? (
            <InsertBody onSave={saveFormData} />
          ) : (
            React.cloneElement(steps[current].content, { formData })
          )}
        </div>
        <div>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => navigate("/")}>
              Done
            </Button>
          )}
          {current === 1 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
      <FloatButton.BackTop style={{ marginBottom: "40px" }} tooltip={<div>Back to Top</div>} />
    </>
  );
}

function InsertBody({ onSave }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const optionsCoSupervisors = OPTIONS_COSUPERVISORS.filter(
    (x) => !selectedItems.includes(x)
  );
  const [form] = Form.useForm();

  function disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  const onFinish = (values) => {
    //Function to save the values of the form when the user clicks save
    onSave(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Title" name="title">
        <Input />
      </Form.Item>
      <Form.Item label="Co-Supervisors" name="coSupervisors">
        <Select
          mode="multiple"
          placeholder="Select Co-Supervisor"
          value={selectedItems}
          onChange={setSelectedItems}
          options={optionsCoSupervisors.map((x) => ({
            value: x,
            label: x,
          }))}
        />
      </Form.Item>
      <Form.Item label="Keywords" name="keywords">
        <Input />
      </Form.Item>
      <Form.Item label="Type" name="type">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={6} />
      </Form.Item>
      <Form.Item label="Required Knowledge" name="requiredKnowledge">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Expiration Date" name="expirationDate">
        <DatePicker disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item name="level" label="Level">
        <Select placeholder="Select a option" allowClear>
          <Option value="bachelor">L - Bachelor Degree</Option>
          <Option value="master">LM - Master Degree</Option>
        </Select>
      </Form.Item>
      <Form.Item name="cds" label="CdS">
        <Select placeholder="Select a option" allowClear>
          <Option value="Scienze delle merendine">
            Scienze delle merendine
          </Option>
          <Option value="Università della vita">Università della vita</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save and Continue
        </Button>
      </Form.Item>
    </Form>
  );
}

function ReviewProposal({ formData }) {
  //Function to retrieve the data of the form inserted in insert body
  return (
    <div>
      <h2>Review Proposal</h2>
      <p>Title: {formData.title}</p>
      <p>Co-Supervisors: {formData.coSupervisors.join(", ")}</p>
      <p>Keywords: {formData.keywords}</p>
      <p>Type: {formData.type}</p>
      <p>Description: {formData.description}</p>
      <p>Required Knowledge: {formData.requiredKnowledge}</p>
      <p>Notes: {formData.notes}</p>
      <p>
        Expiration Date:{" "}
        {formData.expirationDate
          ? formData.expirationDate.format("YYYY-MM-DD")
          : ""}
      </p>
      <p>Level: {formData.level}</p>
      <p>CdS: {formData.cds}</p>
    </div>
  );
}

function Done() {
  return (
    <div>
      <h2>Done</h2>
      <p>You have finished!</p>
    </div>
  );
}

function ThesisProposals() {


  useEffect(() => {
    API.getStudentThesisProposals()
      .then((x) => {
        setData(handleReceivedData(x));
      })
      .catch((err) => {/*err handling w message*/ });
  }, []);

  // Array of objs for storing table data
  const [data, setData] = useState([])

  // Loading table data fetching
  const [loadingTable, setLoadingTable] = useState(false);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      fixed: 'left',
    },
    {
      title: 'Level',
      dataIndex: 'level',
    },
    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
    },
    {
      title: 'Co-Supervisors',
      dataIndex: 'coSupervisors',
    },
    {
      title: 'Keyworkds',
      dataIndex: 'keywords',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
    },
    {
      title: 'Expiration',
      dataIndex: 'expiration',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: () => (
        <Space size="middle">
          <Tooltip title="View Proposal">
            <EyeOutlined style={{ fontSize: '20px' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableProps = {
    bordered: false,
    scroll: { x: true },
    loading: loadingTable,
  };

  function handleReceivedData(data) {
    const formattedData = data.map((x) => ({
      // Take all fields from API.jsx
      ...x,
      // Custom format some of the fields needed
      supervisor: x.supervisor.name + " " + x.supervisor.surname,
      coSupervisors: [].concat(
        x.internalCoSupervisors.map((x) => <Tag color="blue" key={x.id}>{x.name + ' ' + x.surname}</Tag>),
        x.externalCoSupervisors.map((x) => <Tag color="blue" key={x.id}>{x.name + ' ' + x.surname}</Tag>)
      ),
      keywords: x.keywords.map((keyword) => (
        <Tag color="blue" key={keyword}>
          {keyword}
        </Tag>
      )),
      groups: x.internalCoSupervisors
      .map((x) => <Tag color="blue" key={x.id}>{x.codGroup}</Tag>)
    }));
    return formattedData;
  }

  /*const data = [
    {
      key: "1",
      title: "giovanniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      keywords:
      {
        xxxxxxxxxxxxxx.map((tag) => (
          <Tag color="blue" key={tag}>
            {tag}
          </Tag>
        ))
      },
    }
  ]*/

  return (
    <Table {...tableProps} columns={columns} dataSource={data} />
  )
}

export { InsertThesisProposal, ThesisProposals };