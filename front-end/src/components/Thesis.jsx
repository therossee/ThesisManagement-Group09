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

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useEffect(() => {
    
  }, []);

  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(null);

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
          {current === 0 && (
            <InsertBody saveData={saveFormData}/>
          )} {current === 1 && (
            <>
            <ReviewProposal formData={formData}/>
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
              <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
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
  );
}

function InsertBody(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const unselected = coSupervisors.filter((x) => !selectedItems.includes(x));

  const addSupervisors = (extSup) => {
    setCoSupervisors(coSupervisors => [...coSupervisors, ...extSup]);
  };

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
    }).finally(() => {
      setLoading(false);
    })
  }, []);

  function disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  const onFinish = (values) => {
    props.saveData(values);
  };

  return (
    <>
    {loading ?
    <div style={{ marginLeft: "49%", marginRight: "25%", marginTop: "25%"}}>
      <Spin tip="Loading" size="large" />
    </div>
    :
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
        options={coSupervisors.map((x) => ({
          value: x.id, // assuming x.id is a string or number
          label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
        }))}
      />
      </Form.Item>
      <Form.Item label="Keywords" name="keywords">
        <Input />
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
          <Option value="bachelor">L - Bachelor Degree</Option>
          <Option value="master">LM - Master Degree</Option>
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
  }
  </>
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

export { InsertThesisProposal };
