import { React, useState, useEffect, Row, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import { DatePicker, FloatButton, Button, Descriptions, Drawer, Form, Input, Select, Skeleton, Space, Steps, Spin, Result, Typography, Table, Tag, message, Table, Tag, Tooltip, Typography } from "antd";
import API from "../API.jsx";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import API from "../API";

const { Option } = Select;
const { Title } = Typography;
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
    content: <Done/>,
  },
];


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
    })
    .finally(() => {
      setLoading(false);
    })
  }, [current]);

  useEffect(() => {
    if(insert){
      const proposal = {
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
        console.log(obj);
        setProposalId(obj.id);
        next();
      })
      .catch((err) => {
        console.log(err);
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
    <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%"}}>
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
            <InsertBody saveData={saveFormData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} keywords={keywords} degrees={degrees} form={form}/>
          )} 
          {current === 1 && (
            <div style={{marginLeft: "10%"}}>
            <ReviewProposal formData={formData} intCoSupervisors={intCoSupervisors} extCoSupervisors={extCoSupervisors} degrees={degrees}/>
            <div style={{paddingLeft: "35%"}}>
            <Button
              style={{
                margin: "0 8px",
                marginTop: "3%"
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
              <Button type="primary" onClick={addProposal}style={{
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
            <Done proposalId={proposalId} error={error}/>
          }
        </div>
      </div>
      <FloatButton.BackTop style={{ marginBottom: "40px" }} tooltip={<div>Back to Top</div>} />
    </>
    }
  </>
  );
}

function InsertBody(props) {
  const [selectedInt, setSelectedInt] = useState([]);
  const [selectedExt, setSelectedExt] = useState([]);
  const [selectedKw, setSelectedKw] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [lev, setSelLev] = useState("");
  const [selDegrees, setSelDegrees] = useState([]);
  const {keywords, intCoSupervisors, extCoSupervisors, degrees, form} = props;
  const unselectedInt = intCoSupervisors.filter((x) => !selectedInt.includes(x));
  const unselectedExt = extCoSupervisors.filter((x) => !selectedExt.includes(x));

  useEffect(() => {
    if (form.getFieldValue("degreeLevel") === "L") {
      setSelLev("L");
      setSelDegrees(degrees.filter((x) => x.cod_degree.includes("L-")));
    } else if (form.getFieldValue("degreeLevel") === "LM") {
      setSelLev("LM");
      setSelDegrees(degrees.filter((x) => x.cod_degree.includes("LM-")));
    } else {
      setSelLev("");
      setSelDegrees([]);
    }
  }, []);

  const handleInputChange = (value) => {
    setNewKeyword(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newKeyword.trim() !== '') {
      setSelectedKw([...selectedKw, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleSelectKwChange = (values) => {
    setSelectedKw(values);
  };

  const handleDegreeSelection = (lev) => {
    setSelLev(lev);
    form.setFieldValue("cds", "");
    const str = lev === "L" ? "L-" : "LM-";
    setSelDegrees(degrees.filter((x) => x.cod_degree.includes(str)));
  };

  function disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  const onFinish = (values) => {
    props.saveData(values);
  };

  return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[
          {
            required: true,
            message: 'Please input a title!',
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Internal co-Supervisors" name="intCoSupervisors">
        <Select
          mode="multiple"
          placeholder="Select internal co-Supervisors"
          value={selectedInt}
          onChange={setSelectedInt}
          options={unselectedInt.map((x) => ({
            value: x.id, // assuming x.id is a string or number
            label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
            searchValue: `${x.id} ${x.name} ${x.surname}`, // combine id, name, and surname for search
          }))}
          filterOption={(input, option) =>
            option.searchValue.toLowerCase().includes(input.toLowerCase())
          }
        />
        </Form.Item>
        <Form.Item label="External co-Supervisors" name="extCoSupervisors">
        <Select
          mode="multiple"
          placeholder="Select external co-Supervisors"
          value={selectedExt}
          onChange={setSelectedExt}
          options={unselectedExt.map((x) => ({
            value: x.id, // assuming x.id is a string or number
            label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
            searchValue: `${x.id} ${x.name} ${x.surname}`, // combine id, name, and surname for search
          }))}
          filterOption={(input, option) =>
            option.searchValue.toLowerCase().includes(input.toLowerCase())
          }
        />
        </Form.Item>
        <Form.Item label="Keywords" name="keywords" rules={[
          {
            required: true,
            message: 'Please input keywords!',
          },
        ]}>
        <Select
        mode="multiple"
        placeholder="Select keywords"
        value={selectedKw}
        onChange={handleSelectKwChange}
        onInputKeyDown={handleKeyDown}
        onSearch={handleInputChange}
        optionLabelProp="label"
      >
        {keywords.map((kw) => (
          <Option key={kw} value={kw} label={kw}>
            {kw}
          </Option>
        ))}
        {newKeyword.trim() !== '' && !keywords.includes(newKeyword) && (
          <Option key={newKeyword} value={newKeyword} label={newKeyword}>
            {newKeyword}
          </Option>
        )}
      </Select>
        </Form.Item>
        <Form.Item label="Type" name="type" rules={[
          {
            required: true,
            message: 'Please input a type!',
          },
        ]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[
          {
            required: true,
            message: 'Please insert a description for this thesis!',
          },
        ]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item label="Required Knowledge" name="requiredKnowledge" >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Expiration Date" name="expirationDate" rules={[
          {
            required: true,
            message: 'Please select an expiration date!',
          },
        ]}>
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          name="degreeLevel"
          label="Degree Level"
          rules={[
            {
              required: true,
              message: 'Please select a degree level!',
            },
          ]}
        >
          <Select
            placeholder="Select a degree level"
            allowClear
            onChange={handleDegreeSelection}
          >
            <Select.Option value="L">L - Bachelor Degree</Select.Option>
            <Select.Option value="LM">LM - Master Degree</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="cds"
          label="CdS"
          rules={[
            {
              required: true,
              message: 'Please select a CdS!',
            },
          ]}
        >
          <Select placeholder="Select a CdS" allowClear disabled={lev === ""}>
            {selDegrees.map((d) => (d.cod_degree.includes(lev) ?
              <Select.Option key={d.title_degree} value={d.cod_degree}>
                {d.title_degree}
              </Select.Option>
              : null
            ))}
          </Select>  
        </Form.Item>
        <Form.Item>
          <div style={{paddingLeft: "45%"}}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          </div>
        </Form.Item>
      </Form>
  );
}

function ReviewProposal(props) {
  //Function to retrieve the data of the form inserted in insert body
  const formData = props.formData;
  const {intCoSupervisors, extCoSupervisors, degrees} = props;
  const deg = degrees.find((x) => x.cod_degree === formData.cds);
  const level = formData.degreeLevel === "L" ? "L - Bachelor Degree" : "LM - Master Degree";
  let intCoSup = [], extCoSup = [];
  if(formData.intCoSupervisors !== undefined){
    intCoSup = intCoSupervisors.filter((x) => formData.intCoSupervisors.includes(x.id));
  }
  if(formData.extCoSupervisors !== undefined){
    extCoSup = extCoSupervisors.filter((x) => formData.extCoSupervisors.includes(x.id));
  }
  const data = [
    { field: "Title", value: formData.title },
    {
      field: "Internal co-Supervisors",
      value: intCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
    },
    {
      field: "External co-Supervisors",
      value: extCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
    },
    {
      field: "Keywords",
      value: formData.keywords.map((keyword) => <Tag key={keyword}>{keyword}</Tag>),
    },
    { field: "Type", value: formData.type },
    { field: "Description", value: formData.description },
    { field: "Required Knowledge", value: formData.requiredKnowledge },
    { field: "Notes", value: formData.notes },
    {
      field: "Expiration Date",
      value: formData.expirationDate
        ? formData.expirationDate.format("YYYY-MM-DD")
        : "",
    },
    { field: "Level", value: level },
    { field: "CdS", value: `${formData.cds} - ${deg.title_degree}` },
  ];

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: "35%",
      render: (value) => (value === "Field" ? null : <Typography.Text strong>{value}</Typography.Text>),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => (Array.isArray(value) ? value : <span>{value}</span>),
    },
  ];

  return (
    <>
      <Title level={2} style={{paddingLeft: "32%"}}>Review Proposal</Title>
      <Table
        dataSource={data}
        columns={columns}
        size="middle"
        showHeader={false}
        pagination={false}
      />
    </>
  );
}

function Done(props) {
  const navigate = useNavigate();
  const id = props.proposalId;
  const error = props.error;
  if(id !== -1){
    return (
    <Result
      status="success"
      title="Proposal added succesfully!"
      subTitle={`ID of the proposal: ${id}`}
      extra={
      <Button ghost type="primary" onClick={() => navigate("/")}>
        Back Home
      </Button>
    }
  />
    );
  }else{
    return (
      <Result
          status={`${error}`}
          title={`${error}`}
          subTitle="Sorry, something went wrong."
          extra={
            <Button ghost type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
      />
    );
  }
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

  useEffect(() => {
    API.getStudentThesisProposals()
      .then((x) => {
        setData(handleReceivedData(x));
        setIsLoadingTable(false);
      })
      .catch((err) => {/*err handling w message*/ });
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

  // Columns of the table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      fixed: 'left',
      ...filterTitle(),
      render: (text, record) => (
        <Tooltip title="View Proposal">
          <Link to={`/view-proposal/${record.id}`}>
            {text}
          </Link>
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

    return (
      <Drawer size="large" open={isOpen} onClose={() => setIsOpen(false)}>
        "add"
      </Drawer>
    )
  }

  return (
    <>
      <MoreFilters />
      <Table {...tableProps} columns={columns} dataSource={data}
        title={() => <Button type="link" size="small" onClick={() => setIsOpen(true)}>Show even more filters...</Button>} />
    </>
  )
}

function ViewThesisProposal() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { Text } = Typography;

  // Storing all Thesis Proposal Information
  const [data, setData] = useState();

  useEffect(() => {
    API.getThesisProposalbyId(id)
      .then((x) => {
        setData(x);
      })
      .catch((err) => {/* handle error*/ });
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
      <Button type="link" onClick={() => navigate("/proposals")}>&lt; Back to Thesis Proposals</Button>
      <Descriptions title={data.title} layout="vertical" items={items} style={{ marginLeft: "2%", marginRight: "2%" }} />
    </>
  )
}

export { InsertThesisProposal, ThesisProposals, ViewThesisProposal };