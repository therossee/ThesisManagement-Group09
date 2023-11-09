import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Button, Form, Input, Select, Steps } from "antd";

const OPTIONS_COSUPERVISORS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

const steps = [
    {
        title: 'Insert Thesis Proposal',
        content: <InsertBody />,
    },
    {
        title: 'Review Proposal',
        content: 'Second-content',
    },
    {
        title: 'Upload',
        content: 'Last-content',
    },
];

function InsertThesisProposal() {

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };


    return (<>
        <Steps current={current} items={items} style={{ paddingRight: "20%", paddingLeft: "20%" }} />
        <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "3%" }}>
            <div>
                {steps[current].content}
            </div>
            <div>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => navigate("/")}>
                        Done
                    </Button>
                )}
                {current === 1 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Previous
                    </Button>
                )}
            </div>
        </div>
    </>
    )
}

function InsertBody() {

    const [selectedItems, setSelectedItems] = useState([]);
    const optionsCoSupervisors = OPTIONS_COSUPERVISORS.filter((x) => !selectedItems.includes(x));

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() < Date.now();
      }

    return (
        <Form layout="horizontal">
            <Form.Item label="Title">
                <Input />
            </Form.Item>
            <Form.Item label="Co-Supervisors">
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
            <Form.Item label="Keywords">
                <Input />
            </Form.Item>
            <Form.Item label="Type">
                <Input />
            </Form.Item>
            <Form.Item label="Description">
                <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item label="Required Knowledge">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Notes">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Expiration Date">
                <DatePicker disabledDate={disabledDate}/>
            </Form.Item>
        </Form>

    )
}

export { InsertThesisProposal }