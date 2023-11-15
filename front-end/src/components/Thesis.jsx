import React, { useState, useEffect, Row } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, FloatButton, Button, Form, Input, Select, Steps, Spin, Result, Typography, Table, Tag, message } from "antd";
import API from "../API.jsx";

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

export { InsertThesisProposal };
