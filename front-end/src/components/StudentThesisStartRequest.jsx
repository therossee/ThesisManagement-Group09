import { useState, useEffect } from 'react';
import { Button, Descriptions, Col, Row, Typography, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import API from '../API';

dayjs.extend(localizedFormat);

function StudentThesisStartRequest() {
    // Trigger TSR Addition Form Visibility
    const [formVisible, setFormVisible] = useState(false);

    const [trigger, setTrigger] = useState(true);

    const [loading, setLoading] = useState(false);

    const [disabled, setDisabled] = useState(false);

    return (
        <div>
            <Row justify="start">
                {formVisible ?
                    <Button ghost type="primary" onClick={() => setFormVisible(false)}>
                        &lt; Back to Thesis Start Request
                    </Button>
                    :
                    <>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            style={{ marginTop: "10px" }}
                            loading={loading}
                            disabled={disabled}
                            onClick={() => { setFormVisible(true) }}
                        >
                            Add New Thesis Start Request
                        </Button>
                        <Button type="link" icon={<ReloadOutlined />} loading={loading} onClick={() => (setTrigger(!trigger))}>Refresh</Button>
                    </>
                }
            </Row>
            {formVisible ? <AddThesisStartRequestForm setFormVisible={setFormVisible} /> : <ViewThesisStartRequest trigger={trigger} setDisabled={setDisabled} setLoading={setLoading} />}
        </div>
    )
}

function AddThesisStartRequestForm({ setFormVisible }) {

    const { Title } = Typography;

    const [form] = Form.useForm();

    // Loading state for API calls to get teachers
    const [loading, setLoading] = useState(true);

    // Store list of supervisors and co-supervisors
    const [options, setOptions] = useState([]);

    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const teachers = await API.getTeachers();
                const formattedTeachers = teachers.teachers.map((x) => ({
                    value: x.id,
                    label: `${x.name} ${x.surname}`,
                    searchValue: `${x.id} ${x.name} ${x.surname}`,
                }));
                setOptions(formattedTeachers);
                setLoading(false);
            } catch (err) {
                message.error(err.message ? err.message : err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const SubmitButton = ({ form }) => {

        // Validating required form fields
        const [submittable, setSubmittable] = useState(false);

        // Watch all values
        const values = Form.useWatch([], form);

        useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(
                    () => { setSubmittable(true) },
                    () => { setSubmittable(false) },
                );
        }, [values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable && loading} loading={buttonLoading}>
                Submit
            </Button>
        );
    };

    const onFinish = async (values) => {
        setButtonLoading(true);
        try {
            await API.insertThesisStartRequest(values);
            message.success("Thesis Start Request successfully sent!");
            setButtonLoading(false);
            setFormVisible(false);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setButtonLoading(false);
        }
    };

    return (
        <div>
            <Row justify="center">
                <Title level={2}>Thesis Start Request</Title>
            </Row>
            <Row>
                <Col span={5} />
                <Col span={14}>
                    <Form form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title cannot be empty!" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description cannot be empty!" }]}>
                            <Input.TextArea rows={7} />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item
                                    name="supervisor_id"
                                    label="Supervisor"
                                    rules={[{ required: true, message: "Supervisor cannot be empty!" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select the Supervisor"
                                        loading={loading}
                                        options={options}
                                        filterOption={(input, option) =>
                                            option.searchValue.toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item
                                    name="internal_co_supervisors_ids"
                                    label="Internal co-Supervisors"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select the internal co-Supervisors"
                                        loading={loading}
                                        options={options}
                                        filterOption={(input, option) =>
                                            option.searchValue.toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Space>
                                <SubmitButton form={form} />
                                <Button htmlType="reset">Reset Fields</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={5} />
            </Row>
        </div >
    )
}

function ViewThesisStartRequest({ trigger, setLoading, setDisabled }) {

    const [activeThesisStartRequest, setActiveThesisStartRequest] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const activeTSR = await API.getStudentActiveThesisStartRequest();
                if (Object.keys(activeTSR).length > 0)
                    setDisabled(true);
                setActiveThesisStartRequest(activeTSR);
                setLoading(false);
            } catch (err) {
                message.error(err.message ? err.message : err);
                setLoading(false);
            }
        };
        fetchData();
    }, [trigger]);

    if (Object.keys(activeThesisStartRequest).length > 0) {
        return(
        <Descriptions title={"Thesis Start Request Submitted on: " + dayjs(activeThesisStartRequest.creation_date).format('lll')} bordered style={{ marginTop:"20px" }}/>
        )
    }
    else {
        return (
            <h1>No active thesis start request (to change) ............</h1>
        )
    }
}

export default StudentThesisStartRequest;