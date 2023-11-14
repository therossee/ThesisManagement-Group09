import React, { useState, useEffect, Row } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, FloatButton, Button, Form, Input, Select, Steps, Spin } from "antd";
import API from "../API.jsx";

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

  const [keywords, setKeywords] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    API.getTeachers()
    .then((obj) => {
      setCoSupervisors(obj.teachers);
    })
    .catch((err) => {
      setErrorMsg("Failed to fetch teachers");
    });
    API.getExtCoSupervisors()
    .then((obj) => {
      addSupervisors(obj.externalCoSupervisors);
    })
    .catch((err) => {
      setErrorMsg("Failed to fetch external co-supervisors");
    });
    API.getAllKeywords()
    .then((obj) => {
      console.log(obj.keywords);
      setKeywords(obj.keywords);
    })
    .catch((err) => {
      setErrorMsg("Failed to fetch keywords");
    })
    .finally(() => {
      setLoading(false);
    })
  }, [current]);

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
    console.log(data);
    setFormData(data);
    next();
  };

  const addSupervisors = (extSup) => {
    setCoSupervisors(coSupervisors => [...coSupervisors, ...extSup]);
  };

  return (
    <>
    {loading ?
    <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%"}}>
      <Spin tip="Loading" size="large" />
    </div>
    :
    <>
      <Steps
        current={current}
        items={items}
        style={{ paddingRight: "20%", paddingLeft: "20%" }}
      />
      <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "3%" }}>
        <div>
          {current === 0 && (
            <InsertBody saveData={saveFormData} coSupervisors={coSupervisors} keywords={keywords} form={form}/>
          )} {current === 1 && (
            <>
            <ReviewProposal formData={formData}/>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            </>
          )}
        </div>
        <div>
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => navigate("/")}>
              Done
            </Button>
          )}
        </div>
      </div>
      <FloatButton.BackTop style={{ marginBottom: "40px" }} tooltip={<div>Back to Top</div>} />
    </>
    }
  </>
  );
}

function InsertBody(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedKw, setSelectedKw] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const {keywords, coSupervisors, form} = props;
  const unselected = coSupervisors.filter((x) => !selectedItems.includes(x));


  const handleInputChange = (value) => {
    setNewKeyword(value);
    console.log(form);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newKeyword.trim() !== '') {
      setSelectedKw([...selectedKw, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleSelectChange = (values) => {
    setSelectedKw(values);
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
      <Form.Item label="Co-Supervisors" name="coSupervisors">
      <Select
        mode="multiple"
        placeholder="Select Co-Supervisor"
        value={selectedItems}
        onChange={setSelectedItems}
        options={unselected.map((x) => ({
          value: x.id, // assuming x.id is a string or number
          label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
        }))}
      />
      </Form.Item>
      <Form.Item label="Keywords" name="keywords">
      <Select
      mode="multiple"
      placeholder="Select keywords"
      value={selectedKw}
      onChange={handleSelectChange}
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
      <Form.Item name="level" label="Level" rules={[
        {
          required: true,
          message: 'Please select a level!',
        },
      ]}>
        <Select placeholder="Select a option" allowClear>
          <Option value="L">L - Bachelor Degree</Option>
          <Option value="LM">LM - Master Degree</Option>
        </Select>
      </Form.Item>
      <Form.Item name="cds" label="CdS" rules={[
        {
          required: true,
          message: 'Please select a CdS!',
        },
      ]}>
        <Select placeholder="Select a option" allowClear>
          <Option value="Scienze delle merendine">
            Scienze delle merendine
          </Option>
          <Option value="Università della vita">Università della vita</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

function ReviewProposal(props) {
  //Function to retrieve the data of the form inserted in insert body
  const formData = props.formData;
  let coSup;
  if(formData.coSupervisors.length > 0) {
    coSup = formData.coSupervisors;
    console.log(coSup);
  }
  return (
    <div>
      <h2>Review Proposal</h2>
      <p>Title: {formData.title}</p>
      {formData.coSupervisors ?
      <p>Co-Supervisors: {formData.coSupervisors.join(", ")}</p> : <p>Co-Supervisors: </p>}
      {formData.keywords ? 
        <p>Keywords: {formData.keywords.join(", ")}</p> : <p>Keywords: </p>}
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

export { InsertThesisProposal };
