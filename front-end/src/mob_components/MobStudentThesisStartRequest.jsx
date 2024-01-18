import { useState, useEffect } from 'react';
import { Alert, Badge, Button, Col, Row, Typography, Input, Select, message, Skeleton, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Collapse, Space, Form } from "antd-mobile";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import PropTypes from 'prop-types';
import API from '../API';

dayjs.extend(localizedFormat);

function MobStudentThesisStartRequest() {
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
            {formVisible ? <AddTSRForm setFormVisible={setFormVisible} /> : <ViewTSR trigger={trigger} setDisabled={setDisabled} loading={loading} setLoading={setLoading} />}
        </div>
    )
}

function AddTSRForm({ setFormVisible }) {

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
        <div style={{marginBottom: '70px'}}>
                <Title level={2}>Thesis Start Request</Title>
                    <Form form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title cannot be empty!" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description cannot be empty!" }]}>
                            <Input.TextArea rows={7} />
                        </Form.Item>
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
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
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
                                        style={{width: '100%'}}
                                    />
                                </Form.Item>
                        <Form.Item>
                            <Space>
                                <SubmitButton form={form} loading={loading} buttonLoading={buttonLoading} />
                                <Button htmlType="reset">Reset Fields</Button>
                            </Space>
                        </Form.Item>
                    </Form>
        </div >
    )
}

function getStatus(status) {
    switch (status) {
        case "waiting for approval":
            return <Badge status="processing" text={<strong>1/3 - Waiting for secretary approval</strong>} />;
        case "rejected by secretary":
            return <Badge status="error" text={<><strong>1/3 - Rejected by the secretary.</strong> <strong> you can submit a new one</strong></>} />;
        case "accepted by secretary":
            return <Badge status="processing" text={<strong>2/3 - Waiting for approval from the teacher</strong>} />;
        case "changes requested":
            return <Badge status="warning" text={<strong>2/3 - Changes requested</strong>} />;
        case "rejected by teacher":
            return <Badge status="error" text={<><strong>2/3 - Rejected by the teacher.</strong><strong> You can submit a new one</strong></>} />;
        case "accepted by teacher":
            return <Badge status="success" text={<strong>3/3 - Accepted</strong>} />;
        default:
            return <Badge status="error" text={<strong>Failed fetching/parsing information</strong>} />
    }
}

// Function to render supervisor and co-supervisor information with a colored tag
function renderTeacherInfo(name, surname) {
    return (
        <Tag color="blue"> {name} {surname} </Tag>
    );
}

function SubmitButton({ loading, buttonLoading }) {

    // Validating required form fields


    return (
        <Button type="primary" htmlType="submit" disabled={loading} loading={buttonLoading}>
            Submit
        </Button>
    );
};

function ViewTSR({ trigger, loading, setLoading, setDisabled }) {

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

    if (Object.keys(activeThesisStartRequest).length > 0) {

        const coSupComponents = () => {
            console.log(activeThesisStartRequest.co_supervisors);
            if(activeThesisStartRequest.co_supervisors.length > 0){
              return activeThesisStartRequest.co_supervisors.map((cSv, index) => {
                return (
                  <div key={index}>
                    <h3>Co-Supervisor #{index+1}: </h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {renderTeacherInfo(cSv.name, cSv.surname)}
                      <span> - </span>
                      <p style={{ margin: 5 }}>ID: {cSv.id}</p>
                    </div>
                  </div>
                );
              });
            }
          } 

        return (
            loading ?
                <Skeleton active />
                :
                <>
                <div style={{marginBottom: '70px', display: 'flex', alignItems: 'center'}}>
                    <Collapse accordion>
                        <Collapse.Panel key={activeThesisStartRequest.id} title={activeThesisStartRequest.title}>
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
                            <>
                            <h3>Submitted on: </h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            {dayjs(activeThesisStartRequest.creation_date).format('LLL')}
                             </div>
                            <h3>Supervisor: </h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {renderTeacherInfo(activeThesisStartRequest.supervisor.name, activeThesisStartRequest.supervisor.surname)}
                                <span> - </span>
                             <p style={{ margin: 5 }}>ID: {activeThesisStartRequest.supervisor.id}</p>
                          </div>
                          <h3>Status: </h3>
                            <div style={{ display: 'flex', alignItems: 'center'}}>
                                {getStatus(activeThesisStartRequest.status)}
                          </div>
                          <h3>Approval date: </h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {activeThesisStartRequest.approval_date ? dayjs(activeThesisStartRequest.approval_date).format('LLL') : "Not yet approved"}
                          </div>
                          <h3>Description: </h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {activeThesisStartRequest.description}
                          </div>
                          {activeThesisStartRequest.co_supervisors.length > 0 ? coSupComponents() : <></>}
                            </>
                        </Collapse.Panel>
                    </Collapse>
                </div>
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

ViewTSR.propTypes = {
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

AddTSRForm.propTypes = {
    setFormVisible: PropTypes.func.isRequired,
};

export { renderTeacherInfo, MobStudentThesisStartRequest };