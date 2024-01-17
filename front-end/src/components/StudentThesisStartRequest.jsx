import { useState, useEffect } from 'react';
import { Alert, Badge, Button, Descriptions, Col, Row, Typography, Form, Input, Select, Space, message, Skeleton, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import PropTypes from 'prop-types';
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
            <Row justify="start" align="middle" style={{ marginTop: "10px" }}>
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
            {formVisible ? <AddThesisStartRequestForm setFormVisible={setFormVisible} /> : <ViewThesisStartRequest trigger={trigger} setDisabled={setDisabled} loading={loading} setLoading={setLoading} />}
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

    // Excluding X supervisor from the list of co-supervisors
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const teachers = await API.getTeachers();
                const sortedTeachers = teachers.teachers.sort((a, b) => a.surname.localeCompare(b.surname));
                const formattedTeachers = sortedTeachers.map((x) => ({
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
                                        onChange={(value) => {
                                            setSelectedSupervisor(value);
                                            form.resetFields(['internal_co_supervisors_ids'])
                                        }}
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
                                        options={options.map(option => option.value === selectedSupervisor ? { ...option, disabled: true } : option)}
                                        disabled={!selectedSupervisor}
                                        filterOption={(input, option) =>
                                            option.searchValue.toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Space>
                                <SubmitButton form={form} loading={loading} buttonLoading={buttonLoading} />
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


function SubmitButton({ form, loading, buttonLoading }) {

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

function ViewThesisStartRequest({ trigger, loading, setLoading, setDisabled }) {

    const [activeThesisStartRequest, setActiveThesisStartRequest] = useState({});

    const { Title } = Typography;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const activeTSR = await API.getStudentLastThesisStartRequest();
                setDisabled(checkDisabled(activeTSR));
                setActiveThesisStartRequest(activeTSR);
                setLoading(false);
            } catch (err) {
                message.error(err.message ? err.message : err);
                setLoading(false);
            }
        };
        fetchData();
    }, [trigger]);

    function checkDisabled(activeTSR) {
        if ((Object.keys(activeTSR).length > 0))
            if (activeTSR.status != "rejected by secretary" && activeTSR.status != "rejected by teacher")
                return true; // Disable the button to add a new TSR
        return false; // Enable the button to add a new TSR
    }

    function getStatus(status) {
        switch (status) {
            case "waiting for approval":
                return <Badge status="processing" text={<strong>1/3 - Waiting for approval from the secretary</strong>} />;
            case "rejected by secretary":
                return <Badge status="error" text={<strong>1/3 - Rejected by the secretary, you can submit a new one</strong>} />;
            case "accepted by secretary":
                return <Badge status="processing" text={<strong>2/3 - Waiting for approval from the teacher</strong>} />;
            case "changes requested":
                return <Badge status="warning" text={<strong>2/3 - Changes requested</strong>} />;
            case "rejected by teacher":
                return <Badge status="error" text={<strong>2/3 - Rejected by the teacher, you can submit a new one</strong>} />;
            case "accepted by teacher":
                return <Badge status="success" text={<strong>3/3 - Accepted</strong>} />;
            default:
                return <Badge status="error" text={<strong>Failed fetching/parsing information</strong>} />
        }
    }

    // Function to render supervisor and co-supervisor information with a colored tag
    function renderTeacherInfo(name, surname) {
        return (
            <Tag color="#1677ff"> {name} {surname} </Tag>
        );
    }

    if (Object.keys(activeThesisStartRequest).length > 0) {

        // Items of the Table
        const items = [
            {
                key: '1',
                label: 'Thesis Start Request Title',
                span: 3,
                children: activeThesisStartRequest.title,
            },
            {
                key: '2',
                label: 'Submitted on',
                span: 1,
                children: dayjs(activeThesisStartRequest.creation_date).format('LLL'),
            },
            {
                key: '3',
                label: 'Supervisor',
                span: 3,
                children: renderTeacherInfo(activeThesisStartRequest.supervisor.name, activeThesisStartRequest.supervisor.surname),
            },
            {
                key: '4',
                label: 'Supervisor ID',
                span: 1,
                children: activeThesisStartRequest.supervisor.id,
            },
            {
                key: '5',
                label: 'Status',
                span: 3,
                children: getStatus(activeThesisStartRequest.status),
            },
            {
                key: '6',
                label: 'Approval Date',
                span: 1,
                children: activeThesisStartRequest.approval_date ? dayjs(activeThesisStartRequest.approval_date).format('lll') : "Not yet approved",
            },
            {
                key: '7',
                label: 'Description',
                span: 4,
                children: activeThesisStartRequest.description,
            },
        ];

        // Add co-supervisors to the items array
        activeThesisStartRequest.co_supervisors.forEach((cosupervisor, index) => {
            const cosupervisorItem = {
                key: `co-supervisor-${index}`,
                label: `Co-Supervisor #${index + 1}`,
                span: 3,
                children: renderTeacherInfo(cosupervisor.name, cosupervisor.surname),
            };
            const cosupervisorIdItem = {
                key: `co-supervisor-id-${index}`,
                label: `Co-Supervisor #${index + 1} ID`,
                span: 1,
                children: cosupervisor.id,
            };
            items.splice(4 + index * 2, 0, cosupervisorItem, cosupervisorIdItem);
        });

        return (
            loading ?
                <Skeleton active />
                :
                <>
                    {activeThesisStartRequest.status === "changes requested" &&
                        <Alert
                            message="The supervisor has requested changes to your submission."
                            description={<><strong>Teacher Message:</strong> {activeThesisStartRequest.changes_requested}</>}
                            type="warning"
                            showIcon
                            closable
                            style={{ marginTop: "10px" }}
                        />
                    }
                    <Descriptions
                        bordered
                        size="small"
                        column={4}
                        items={items}
                        labelStyle={{ fontWeight: "bold" }}
                        style={{ marginTop: "20px" }} />
                </>
        )
    }
    else {
        return (
            <Row justify="start">
                <Title level={4}>Submit your first Thesis Start Request using the button on the top-left corner!</Title>
            </Row>
        )
    }
}

ViewThesisStartRequest.propTypes = {
    trigger: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    setDisabled: PropTypes.func.isRequired,
};

SubmitButton.propTypes = {
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    buttonLoading: PropTypes.bool.isRequired,
};

AddThesisStartRequestForm.propTypes = {
    setFormVisible: PropTypes.func.isRequired,
};

export default StudentThesisStartRequest;