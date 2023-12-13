import { useState, useEffect } from "react";
import { Form, Input, TextArea, Button, AutoCenter } from "antd-mobile";
import { Select } from 'antd';
import Flatpickr from "react-flatpickr";
import { Option } from "antd/lib/mentions";
import dayjs from "dayjs";

function MobInsertBody(props) {
  const [selectedInt, setSelectedInt] = useState([]);
  const [selectedExt, setSelectedExt] = useState([]);
  const [selectedKw, setSelectedKw] = useState([]);
  const [selectedCds, setSelectedCds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [newKeyword, setNewKeyword] = useState("");
  const [lev, setSelLev] = useState("");
  const [selDegrees, setSelDegrees] = useState([]);
  const { keywords, intCoSupervisors, extCoSupervisors, degrees, form, date } = props;
  const unselectedInt = intCoSupervisors.filter((x) => !selectedInt.includes(x));
  const unselectedExt = extCoSupervisors.filter((x) => !selectedExt.includes(x));
  const unselectedCds = selDegrees.filter((x) => !selectedCds.includes(x));

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
          style={{width: '100%'}}
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
          value={selectedKw}
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
        <TextArea rows={6} />
      </Form.Item>
      <Form.Item label="Required Knowledge" name="requiredKnowledge" >
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
          disabled={disabledDate}
          defaultDate={date}
          onChange={(date) => {setSelectedDate(date[0]); form.setFieldValue('expirationDate', date[0])}}
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
          value={selectedCds}
          onChange={setSelectedCds}
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
  );
}

export { MobInsertBody };