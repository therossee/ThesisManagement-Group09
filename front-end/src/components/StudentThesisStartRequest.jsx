import { useState, useEffect } from 'react';
import { Button, Col, Row, Typography, Form, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
                        style={{ marginLeft: "1%", marginTop: "1%" }}
                        onClick={() => { setFormVisible(true) }}
                    >
                        Add New Thesis Start Request
                    </Button>
                }
            </Row>
            {formVisible ? <AddThesisStartRequestForm /> : null}
        </div>
    )
}

function AddThesisStartRequestForm() {

    const { Title } = Typography;

    const [form] = Form.useForm();

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
                    () => {
                        setSubmittable(true);
                    },
                    () => {
                        setSubmittable(false);
                    },
                );
        }, [values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                Submit
            </Button>
        );
    };

    return (
        <div>
            <Row justify="center">
                <Title level={2}>Thesis Start Request</Title>
            </Row>
            <Row>
                <Col span={5} />
                <Col span={14}>
                    <Form form={form} name="validateOnly" layout="vertical">
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title cannot be empty!" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description cannot be empty!" }]}>
                        <Input.TextArea rows={7} />
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

export default StudentThesisStartRequest;