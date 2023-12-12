import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Space, Table, Form, Drawer, DatePicker, Tag, Tooltip, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import API from '../API';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function StudentThesisProposals() {

    // Array of objs for storing table data
    const [data, setData] = useState([])

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    // Drawer for viewing more filters
    const [isOpen, setIsOpen] = useState(false);

    // Store filter date range
    const [dateRange, setDateRange] = useState([]);

    const messageApi = message.useMessage();

    // Set virtual clock date to prevent filtering for a date before virtual clock one
    const date = dayjs();

    const filterTitle = () => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder="Search Title"
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: '100%', marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record.title.toLowerCase().includes(value.toLowerCase()),
    });

    useEffect(() => {
        API.getClock()
            .then((x) => {
                setClock(dayjs().add(x.offset, 'ms'));
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
        API.getThesisProposals()
            .then((x) => {
                setData(handleReceivedData(x));
                setIsLoadingTable(false);
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
        
    }, []);

    const navigate = useNavigate();

    // Store more filters data
    const [moreFiltersData, setMoreFiltersData] = useState({
        description: "",
        knowledge: "",
        notes: ""
    });

    // Data after filtering with moreFilterData values
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (data) {
            const filtered = data.filter(item => {
                return (
                    item.description.includes(moreFiltersData.description) &&
                    item.requiredKnowledge.includes(moreFiltersData.knowledge) &&
                    item.notes.includes(moreFiltersData.notes)
                )
            });
            setFilteredData(filtered);
        }
    }, [data, moreFiltersData]);

    function disabledDate(current) {
        return current?.isSameOrBefore(date);
    }

    // Columns of the table
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            fixed: 'left',
            ...filterTitle(),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            sorter: (a, b) => a.level.localeCompare(b.level),
            onFilter: (value, record) => record.level === value,
            filters: data.reduce((accumulator, x) => {
                // Check if there is alreadythe obj
                const existingObject = accumulator.find(item => item.value === x.level);
                // If not found add it
                if (!existingObject) {
                    accumulator.push({
                        text: x.level,
                        value: x.level,
                    });
                }
                return accumulator;
            }, []),
        },
        {
            title: 'Supervisor',
            dataIndex: 'supervisor',
            // Search in the table is implemented usign uinique ids (for homonymy)
            onFilter: (value, record) => record.supervisor.id === value,
            filterSearch: (input, record) => (
                // Search for id or for name/surname
                record.value.toLowerCase().includes(input.toLowerCase()) ||
                input.toLowerCase().split(" ").every(term => record.text.toLowerCase().includes(term))
            ),
            filters: data.reduce((accumulator, x) => {
                // Check if there is already the obj
                const existingObject = accumulator.find(item => item.value === x.supervisor.id);
                // If not add it
                if (!existingObject) {
                    accumulator.push({
                        text: x.supervisor.name + " " + x.supervisor.surname,
                        value: x.supervisor.id,
                    });
                }
                return accumulator;
            }, []),
            render: (_, x) => (
                <Tag color="blue">
                    {x.supervisor.name + " " + x.supervisor.surname}
                </Tag>
            ),
        },
        {
            title: 'Co-Supervisors',
            dataIndex: 'coSupervisors',
            onFilter: (value, record) => record.coSupervisors.some(cosupervisor => cosupervisor.id === value),
            filterSearch: (input, record) => (
                // Search for id or for name/surname
                // toString needed because externalCoSupervisors (put inside coSupervisors) has an int id
                record.value.toString().toLowerCase().includes(input.toLowerCase()) ||
                input.toLowerCase().split(" ").every(term => record.text.toLowerCase().includes(term))
            ),
            filters: data.reduce((accumulator, x) => {
                x.coSupervisors.forEach(cosupervisor => {
                    // Check if there is already the obj
                    const existingObject = accumulator.find(item => item.value === cosupervisor.id);
                    // If not add it
                    if (!existingObject) {
                        accumulator.push({
                            text: cosupervisor.name + " " + cosupervisor.surname,
                            value: cosupervisor.id,
                        });
                    }
                });
                return accumulator;
            }, []),
            render: (_, x) => x.coSupervisors.map((cosupervisor, i) => (
                <Tag color="blue" key={i}>
                    {cosupervisor.name + " " + cosupervisor.surname}
                </Tag>
            )),
        },
        {
            title: 'Keywords',
            dataIndex: 'keywords',
            onFilter: (value, record) => record.keywords.includes(value),
            filterSearch: true,
            filters: data.reduce((accumulator, x) => {
                x.keywords.forEach(keyword => {
                    // Check if there is already the obj
                    const existingObject = accumulator.find(item => item.value === keyword);
                    // If not add it
                    if (!existingObject) {
                        accumulator.push({
                            text: keyword,
                            value: keyword,
                        });
                    }
                });
                return accumulator;
            }, []),
            render: (_, x) => x.keywords.map((keyword, i) => (
                <Tag color="blue" key={i}>
                    {keyword}
                </Tag>
            )),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
            onFilter: (value, record) => record.type === value,
            filters: data.reduce((accumulator, x) => {
                // Check if there is alreadythe obj
                const existingObject = accumulator.find(item => item.value === x.type);
                // If not found add it
                if (!existingObject) {
                    accumulator.push({
                        text: x.type,
                        value: x.type,
                    });
                }
                return accumulator;
            }, []),
        },
        {
            title: 'Groups',
            dataIndex: 'groups',
            onFilter: (value, record) => record.groups.includes(value),
            filterSearch: true,
            filters: data.reduce((accumulator, x) => {
                x.groups.forEach(group => {
                    // Check if there is already the obj
                    const existingObject = accumulator.find(item => item.value === group);
                    // If not add it
                    if (!existingObject) {
                        accumulator.push({
                            text: group,
                            value: group,
                        });
                    }
                });
                return accumulator;
            }, []),
            render: (_, x) => x.groups.map((group, i) => (
                <Tag color="blue" key={i}>
                    {group}
                </Tag>
            )),
        },
        {
            title: 'Expiration',
            dataIndex: 'expiration',
            sorter: (a, b) => new Date(a.expiration) - new Date(b.expiration),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => {
                const onDateChange = (dates) => {
                    setDateRange(dates);
                    setSelectedKeys(dates);
                };

                return (
                    <div style={{ padding: 8 }}>
                        <DatePicker.RangePicker
                            value={selectedKeys}
                            onChange={onDateChange}
                            disabledDate={disabledDate}
                            format="YYYY-MM-DD"
                        />
                        <Space style={{ marginLeft: "8px" }}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<SearchOutlined />}
                                onClick={() => { confirm() }}
                            >
                                Search
                            </Button>
                            <Button size="small" onClick={() => { clearFilters(); setSelectedKeys([]); }}>
                                Reset
                            </Button>
                            <Button type="link" size="small" onClick={() => close()}>
                                close
                            </Button>
                        </Space>
                    </div>
                );
            },
            onFilter: (value, record) => (dayjs(record.expiration).isSameOrAfter(dateRange[0], 'day') && dayjs(record.expiration).isSameOrBefore(dateRange[1], 'day')),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Proposal">
                        <EyeOutlined style={{ fontSize: '20px' }} onClick={() => navigate(`/view-proposal/${record.id}`)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Some props regarding the table
    const tableProps = {
        bordered: false,
        scroll: { x: true },
        loading: isLoadingTable,
    };

    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

        return formattedData;
    }

    function MoreFilters() {

        const [form] = Form.useForm();

        const saveMoreFiltersData = () => {
            setMoreFiltersData({
                description: form.getFieldsValue().description,
                knowledge: form.getFieldsValue().knowledge,
                notes: form.getFieldsValue().notes
            });
        };

        const handleSubmit = () => {
            setIsOpen(false);
            saveMoreFiltersData();
        };

        const handleReset = () => {
            form.setFieldsValue({
                description: "",
                knowledge: "",
                notes: ""
            });
        };

        return (
            <Drawer
                size="large"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                extra={
                    <Space>
                        <Button onClick={handleReset}>Reset Fields</Button>
                        <Button type="primary" onClick={handleSubmit}>
                            Submit Filters
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form} initialValues={moreFiltersData}>
                    <Form.Item name="description" label="Description:">
                        <Input.TextArea rows={6} />
                    </Form.Item>
                    <Form.Item name="knowledge" label="Required Knowledge:">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="notes" label="Notes:">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Drawer>

        );
    }

    return (
        <>
            <MoreFilters />
            <Table {...tableProps} columns={columns} dataSource={filteredData}
                title={() => <Button type="link" size="small" onClick={() => setIsOpen(true)}>Show even more filters...</Button>} />
        </>
    )
}

export default StudentThesisProposals;