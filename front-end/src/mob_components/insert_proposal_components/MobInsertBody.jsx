import { useState, useEffect } from "react";
import { Form, Input, TextArea, Button, AutoCenter } from "antd-mobile";
import { Select } from 'antd';
import Flatpickr from "react-flatpickr";
import { Option } from "antd/lib/mentions";
import PropTypes from "prop-types";

function MobInsertBody(props) {
  const [selIntCoSup, setSelIntCoSup] = useState([]);
  const [selExtCoSup, setSelExtCoSup] = useState([]);
  const [selKeywords, setSelKeywords] = useState([]);
  const [selCdS, setSelCdS] = useState([]);
  const [newKw, setNewKw] = useState("");
  const [lev, setLev] = useState("");
  const [selDegrees, setSelDegrees] = useState([]);
  const { keywords, intCoSupervisors, extCoSupervisors, degrees, form, date } = props;
  const unselectedInt = intCoSupervisors.filter((x) => !selIntCoSup.includes(x));
  const unselectedExt = extCoSupervisors.filter((x) => !selExtCoSup.includes(x));
  const unselectedCds = selDegrees.filter((x) => !selCdS.includes(x));

  useEffect(() => {
    if (form.getFieldValue("degreeLevel") === "L") {
      setLev("L");
      setSelDegrees(degrees.filter((x) => x.cod_degree.includes("L-")));
    } else if (form.getFieldValue("degreeLevel") === "LM") {
      setLev("LM");
      setSelDegrees(degrees.filter((x) => x.cod_degree.includes("LM-")));
    } else {
      setLev("");
      setSelDegrees([]);
    }
  }, []);


  const handleInputChange = (value) => {
    setNewKw(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newKw.trim() !== '') {
      setSelKeywords([...selKeywords, newKw]);
      setNewKw('');
    }
  };

  const handleSelectKwChange = (values) => {
    setSelKeywords(values);
  };

  const handleDegreeSelection = (lev) => {
    setLev(lev);
    form.setFieldValue("cds", []);
    const str = lev === "L" ? "L-" : "LM-";
    setSelDegrees(degrees.filter((x) => x.cod_degree.includes(str)));
  };

  function disabledDate(current) {
    return current && current.valueOf() < date;
  }

  const onFinish = (values) => {
    props.saveData(values);
  };

  return (
    <div style={{marginRight: "5px", marginLeft: "5px"}}>
    <Form form={form} layout="vertical" onFinish={onFinish}
      onValuesChange={(changedValues) => {
        if (changedValues.degreeLevel) {
          form.setFieldsValue({ cds: [] });
        }
      }}>
      <Form.Item label="Title" name="title" rules={[
        {
          required: true,
          message: 'Please input a title!',
        },
      ]}>
        <TextArea />
      </Form.Item>
      <Form.Item label="Internal co-Supervisors" name="intCoSupervisors">
        <Select
          mode="multiple"
          placeholder="Select internal co-Supervisors"
          value={selIntCoSup}
          onChange={setSelIntCoSup}
          options={unselectedInt.map((x) => ({
            value: x.id, // assuming x.id is a string or number
            label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
            searchValue: `${x.id} ${x.name} ${x.surname}`, // combine id, name, and surname for search
          }))}
          filterOption={(input, option) =>
            option.searchValue.toLowerCase().includes(input.toLowerCase())
          }
          style={{width: '100%'}}
        />
      </Form.Item>
      <Form.Item label="External co-Supervisors" name="extCoSupervisors">
        <Select
          mode="multiple"
          placeholder="Select external co-Supervisors"
          value={selExtCoSup}
          onChange={setSelExtCoSup}
          options={unselectedExt.map((x) => ({
            value: x.id, // assuming x.id is a string or number
            label: `${x.name} ${x.surname}`, // assuming x.name and x.surname are strings
            searchValue: `${x.id} ${x.name} ${x.surname}`, // combine id, name, and surname for search
          }))}
          filterOption={(input, option) =>
            option.searchValue.toLowerCase().includes(input.toLowerCase())
          }
          style={{width: '100%'}}
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
          value={selKeywords}
          onChange={handleSelectKwChange}
          onInputKeyDown={handleKeyDown}
          onSearch={handleInputChange}
          optionLabelProp="label"
          style={{width: "100%"}}
        >
          {keywords.map((kw) => (
            <Option key={kw} value={kw} label={kw}>
              {kw}
            </Option>
          ))}
          {newKw.trim() !== '' && !keywords.includes(newKw) && (
            <Option key={newKw} value={newKw} label={newKw}>
              {newKw}
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
        <TextArea rows={6} />
      </Form.Item>
      <Form.Item label="Required Knowledge" name="requiredKnowledge" rules={[
        {
        required: true,
        message: 'Please enter the required knowledge for this thesis!',
        }
      ]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Expiration Date" name="expirationDate" rules={[
        {
          required: true,
          message: 'Please select an expiration date!',
        },
      ]}>
        <div style={{width: '100%'}}>
        <Flatpickr
          options={{
            dateFormat: 'm/d/Y',
          }}
          disable={disabledDate}
          defaultDate={date}
          onChange={(date) => {form.setFieldValue('expirationDate', new Date(date[0]))}}
        />
        </div>
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
          style={{width: '100%'}}
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
            message: 'Please select at least one CdS!',
          },
        ]}>
        <Select
          mode="multiple"
          placeholder="Select one or more CdS"
          value={selCdS}
          onChange={setSelCdS}
          options={unselectedCds.map((x) => ({
            value: x.cod_degree, // assuming x.id is a string or number
            label: `${x.title_degree}`, // assuming x.name and x.surname are strings
            searchValue: `${x.cod_degree} ${x.title_degree}`, // combine id, name, and surname for search
          }))}
          disabled={lev === ""}
          filterOption={(input, option) =>
            option.searchValue.toLowerCase().includes(input.toLowerCase())
          }
          style={{width: '100%'}}
          maxTagTextLength={30}
        />
      </Form.Item>
      <Form.Item>
        <div style={{ marginBottom: "65px" }}>
          <AutoCenter>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          </AutoCenter>
        </div>
      </Form.Item>
    </Form>
    </div>
  );
}

MobInsertBody.propTypes = {
  keywords: PropTypes.array.isRequired,
  intCoSupervisors: PropTypes.array.isRequired,
  extCoSupervisors: PropTypes.array.isRequired,
  degrees: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  saveData: PropTypes.func.isRequired,
};

export { MobInsertBody };