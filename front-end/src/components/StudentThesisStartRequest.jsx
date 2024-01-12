import { useState, useEffect } from 'react';
import { Button, Col, Row, Typography, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import API from '../API';

function StudentThesisStartRequest() {
    // Trigger TSR Addition Form Visibility
    const [formVisible, setFormVisible] = useState(false);

    return (
        <div>
            <Row justify="start">
                {formVisible ?
                    <Button ghost type="primary">
                        &lt; Back to Thesis Start Request
                    </Button>
                    :
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ marginTop: "10px" }}
                        onClick={() => { setFormVisible(true) }}
                    >
                        Add New Thesis Start Request
                    </Button>
                }
            </Row>
            {formVisible ? <AddThesisStartRequestForm /> : <ViewThesisStartRequest />}
        </div>
    )
}

function AddThesisStartRequestForm() {

    const { Title } = Typography;

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);

    // Store list of supervisors and co-supervisors
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const teachers = await API.getTeachers();
                setOptions(teachers);
                setLoading(false);
            } catch (err) {
                message.error(err.message ? err.message : err);
            }
        };
        fetchData();
    }, []);

    const SubmitButton = ({ form }) => {
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
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                Submit
            </Button>
        );
    };

    const onFinish = (values) => {
        console.log('Received values from form: ', values);
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
                        <Form.Item name="supervisor" label="Supervisor" rules={[{ required: true, message: "Supervisor cannot be empty!" }]}>
                            <Select
                                placeholder="Select the Supervisor"
                                loading={loading}
                                options={options}
                                filterOption={(input, option) =>
                                    option.searchValue.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                        <Form.Item name="co-supervisors" label="Internal co-Supervisors">
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
        </div>
    )
}

function ViewThesisStartRequest() {
    return (
        <></>
    )
}

export default StudentThesisStartRequest;