import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { DatePicker, FloatButton, Button, Descriptions, Drawer, Form, Input, Select, Skeleton, Space, Steps, Table, Tag, Tooltip, Typography, message } from "antd";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import API from "../API";

const { Option } = Select;

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

  const filterTitle = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search Title"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: '100%', marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record['title'].toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      <Highlighter
        highlightStyle={{
          backgroundColor: '#ffc069',
          padding: 0
        }}
        searchWords={[searchTitle]}
        autoEscape
        textToHighlight={text ? text : ''}
      />
  });

  const [messageApi, messageBox] = message.useMessage();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    API.getStudentThesisProposals()
      .then((x) => {
        setData(handleReceivedData(x));
        setIsLoadingTable(false);
      })
      .catch((err) => { messageApi.error(err.message ? err.message : err)  });
    API.getStudentApplications()
      .then((x) => {
        setApplications(x);
      })
      .catch((err) => { messageApi.error(err.message ? err.message : err)  });
  }, []);

  // Array of objs for storing table data
  const [data, setData] = useState([])

  // Loading table data fetching
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // Storing Title Search filter
  const [searchTitle, setSearchTitle] = useState('');

  // Drawer for viewing more filters
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Store more filters data
  const [moreFiltersData, setMoreFiltersData] = useState({
    description: "",
    knowledge: "",
    notes: ""
  });

  // Data after filtering with moreFilterData values
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter(item => {
        return (
          item.description.includes(moreFiltersData.description) &&
          item.requiredKnowledge.includes(moreFiltersData.knowledge) &&
          item.notes.includes(moreFiltersData.notes)
        )
      });
      setFilteredData(filtered);
    }
  }, [data, moreFiltersData]);

  // Columns of the table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      fixed: 'left',
      ...filterTitle(),
      render: (text, record) => (
        <Tooltip title="View Proposal">
          {text}
        </Tooltip>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      sorter: (a, b) => a.level.localeCompare(b.level),
      onFilter: (value, record) => record.level === value,
      filters: data.reduce((accumulator, x) => {
        // Check if there is alreadythe obj
        const existingObject = accumulator.find(item => item.value === x.level);
        // If not found add it
        if (!existingObject) {
          accumulator.push({
            text: x.level,
            value: x.level,
          });
        }
        return accumulator;
      }, []),
    },
    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
      // Search in the table is implemented usign uinique ids (for homonymy)
      onFilter: (value, record) => record.supervisor.id === value,
      filterSearch: (input, record) => (
        // Search for id or for name/surname
        record.value.toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().split(" ").every(term => record.text.toLowerCase().includes(term))
      ),
      filters: data.reduce((accumulator, x) => {
        // Check if there is already the obj
        const existingObject = accumulator.find(item => item.value === x.supervisor.id);
        // If not add it
        if (!existingObject) {
          accumulator.push({
            text: x.supervisor.name + " " + x.supervisor.surname,
            value: x.supervisor.id,
          });
        }
        return accumulator;
      }, []),
      render: (_, x) => (
        <Tag color="blue">
          {x.supervisor.name + " " + x.supervisor.surname}
        </Tag>
      ),
    },
    {
      title: 'Co-Supervisors',
      dataIndex: 'coSupervisors',
      onFilter: (value, record) => record.coSupervisors.some(cosupervisor => cosupervisor.id === value),
      filterSearch: (input, record) => (
        // Search for id or for name/surname
        // toString needed because externalCoSupervisors (put inside coSupervisors) has an int id
        record.value.toString().toLowerCase().includes(input.toLowerCase()) ||
        input.toLowerCase().split(" ").every(term => record.text.toLowerCase().includes(term))
      ),
      filters: data.reduce((accumulator, x) => {
        x.coSupervisors.forEach(cosupervisor => {
          // Check if there is already the obj
          const existingObject = accumulator.find(item => item.value === cosupervisor.id);
          // If not add it
          if (!existingObject) {
            accumulator.push({
              text: cosupervisor.name + " " + cosupervisor.surname,
              value: cosupervisor.id,
            });
          }
        });
        return accumulator;
      }, []),
      render: (_, x) => x.coSupervisors.map((cosupervisor, i) => (
        <Tag color="blue" key={i}>
          {cosupervisor.name + " " + cosupervisor.surname}
        </Tag>
      )),
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      onFilter: (value, record) => record.keywords.includes(value),
      filterSearch: true,
      filters: data.reduce((accumulator, x) => {
        x.keywords.forEach(keyword => {
          // Check if there is already the obj
          const existingObject = accumulator.find(item => item.value === keyword);
          // If not add it
          if (!existingObject) {
            accumulator.push({
              text: keyword,
              value: keyword,
            });
          }
        });
        return accumulator;
      }, []),
      render: (_, x) => x.keywords.map((keyword, i) => (
        <Tag color="blue" key={i}>
          {keyword}
        </Tag>
      )),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      onFilter: (value, record) => record.type === value,
      filters: data.reduce((accumulator, x) => {
        // Check if there is alreadythe obj
        const existingObject = accumulator.find(item => item.value === x.type);
        // If not found add it
        if (!existingObject) {
          accumulator.push({
            text: x.type,
            value: x.type,
          });
        }
        return accumulator;
      }, []),
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      onFilter: (value, record) => record.groups.includes(value),
      filterSearch: true,
      filters: data.reduce((accumulator, x) => {
        x.groups.forEach(group => {
          // Check if there is already the obj
          const existingObject = accumulator.find(item => item.value === group);
          // If not add it
          if (!existingObject) {
            accumulator.push({
              text: group,
              value: group,
            });
          }
        });
        return accumulator;
      }, []),
      render: (_, x) => x.groups.map((group, i) => (
        <Tag color="blue" key={i}>
          {group}
        </Tag>
      )),
    },
    {
      title: 'Expiration',
      dataIndex: 'expiration',
      sorter: (a, b) => new Date(a.expiration) - new Date(b.expiration),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <Tooltip title="View Proposal">
            <EyeOutlined style={{ fontSize: '20px' }} onClick={() => navigate(`/view-proposal/${record.id}`)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Some props regarding the table
  const tableProps = {
    bordered: false,
    scroll: { x: true },
    loading: isLoadingTable,
  };

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchTitle(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchTitle('');
  };

  function handleReceivedData(data) {

    const formattedData = data.map((x) => ({
      // Take all fields from API.jsx
      ...x,
      // Concatenate internal/external co-supervisors
      coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
    }));

    return formattedData;
  }

  function MoreFilters() {

    const [form] = Form.useForm();

    const savemoreFiltersData = () => {
      setMoreFiltersData({
        description: form.getFieldsValue().description,
        knowledge: form.getFieldsValue().knowledge,
        notes: form.getFieldsValue().notes
      });
    };

    const handleSubmit = () => {
      setIsOpen(false);
      savemoreFiltersData();
    };

    const handleReset = () => {
      form.setFieldsValue({
        description: "",
        knowledge: "",
        notes: ""
      });
    };

    return (
      <Drawer
        size="large"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        extra={
          <Space>
            <Button onClick={() => handleReset()}>Reset Fields</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit Filters
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} initialValues={moreFiltersData}>
          <Form.Item name="description" label="Description:">
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="knowledge" label="Required Knowledge:">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="notes" label="Notes:">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Drawer>

    );
  }

  return (
    <>
      {messageBox}
      <MoreFilters />
      <Table {...tableProps} columns={columns} dataSource={filteredData}
        title={() => <Button type="link" size="small" onClick={() => setIsOpen(true)}>Show even more filters...</Button>} />
    </>
  )
}

function ViewThesisProposal() {

  const [messageApi, messageBox] = message.useMessage();

  const { id } = useParams();
  const { Text } = Typography;
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);


  // Storing all Thesis Proposal Information
  const [data, setData] = useState();

  const applyForProposal = () => {
    setDisabled(true);
  }

  useEffect(() => {
    if(disabled) {
      API.applyForProposal(parseInt(id))
      .then(() => {
        messageApi.success("Application sent!");
      })
      .catch((err) => { 
        setDisabled(false);
        messageApi.error(err.message ? err.message : err)  
      });
    }

  }, [disabled]);

  useEffect(() => {
    API.getThesisProposalbyId(id)
      .then((x) => {
        setData(x);
      })
      .catch((err) => { messageApi.error(err.message ? err.message : err)  })
    API.getStudentApplications()
    .then((x) => {
      setDisabled(x.includes(id));
    })
    .catch((err) => { messageApi.error(err.message ? err.message : err)  });
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
      <div style={{paddingLeft: "2%"}}>
        <Button type="primary" disabled={disabled} onClick={applyForProposal}>Apply for this proposal</Button>
      </div>
    </>
  )
}

export { InsertThesisProposal, ThesisProposals, ViewThesisProposal };