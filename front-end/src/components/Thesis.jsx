import React, { useState, useEffect, Row } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker, FloatButton, Button, Form, Input, Select, Steps, Spin } from "antd";
import API from "../API.jsx";

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

  useEffect(() => {}, []);

  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);


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
      <Steps
        current={current}
        items={items}
        style={{ paddingRight: "20%", paddingLeft: "20%" }}
      />
      <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "3%" }}>
        <div>
          {current === 0 && (
            <InsertBody saveData={saveFormData} />
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
  }
    </>
  );
}

function InsertBody(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const optionsCoSupervisors = OPTIONS_COSUPERVISORS.filter(
    (x) => !selectedItems.includes(x)
  );
  const [form] = Form.useForm();

  function disabledDate(current) {
    return current && current.valueOf() < Date.now();
  }

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.saveData(values);
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
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

function ReviewProposal(props) {
  //Function to retrieve the data of the form inserted in insert body
  const formData = props.formData;
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
