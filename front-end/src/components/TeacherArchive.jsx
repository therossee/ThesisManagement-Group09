import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Space, Table, Tooltip, Modal, Typography, DatePicker } from 'antd';
import { EditOutlined, EyeOutlined, SelectOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { generateCommonColumns } from './utils';
import API from '../API';

function TeacherArchive() {

    const navigate = useNavigate();

    // Array of objs for storing table data
    const [data, setData] = useState([])

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    const [dirty, setDirty] = useState(true);

    // Set virtual clock date to prevent filtering for a date before virtual clock one
    const [date, setDate] = useState(dayjs());

    const { Paragraph, Text } = Typography;

    const [newExpiration, setNewExpiration] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    // Columns of the table
    const columns = [
        ...generateCommonColumns(),
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Proposal">
                        <EyeOutlined style={{ fontSize: '20px' }} onClick={() => navigate(`/view-proposal/${record.id}`, { state: { prevRoute: 'archive' } })} />
                    </Tooltip>
                    <Tooltip title="Edit Proposal">
                        <EditOutlined 
                            style = {{
                                fontSize: '20px',
                                color: record.status === 'ASSIGNED' ? 'rgba(0, 0, 0, 0.25)' : 'inherit',
                                cursor: record.status === 'ASSIGNED' ? 'not-allowed' : 'pointer' }}
                            onClick={() => { 
                                if(record.status!=='ASSIGNED') 
                                    navigate(`/edit-proposal/${record.id}`)
                            }} 
                        />
                    </Tooltip>
                    <Tooltip title="Publish Proposal" disabled={record.status === 'ASSIGNED'}>
                        <SelectOutlined  
                            style = {{
                                fontSize: '20px',
                                color: record.status === 'ASSIGNED' ? 'rgba(0, 0, 0, 0.25)' : 'inherit',
                                cursor: record.status === 'ASSIGNED' ? 'not-allowed' : 'pointer' }}
                            onClick={async() => {
                                const expiration = new Date(record.expiration); 
                                const now = (await API.getClock()).date;
                                if(expiration > now) {
                                    showModal(
                                        "Confirm action",
                                        <div>
                                            <Paragraph>
                                                <Text strong>
                                                    Are you sure you want to re-publish this thesis proposal?
                                                </Text>
                                            </Paragraph>
                                            <Paragraph>
                                                <Text strong>Thesis title: </Text><Text>{record.title}</Text>
                                            </Paragraph>
                                        </div>,
                                        () => publishProposalById(record),
                                        "Yes, publish it",
                                        "No, keep it in the archive",
                                    )
                                }
                                else {
                                    showModal(
                                        "Set a new expiration date and publish",
                                        <div>
                                            <Paragraph>
                                                <Text>
                                                   Since this thesis proposal is expired, before re-publishing it, please select a new expiration date.
                                                </Text>
                                            </Paragraph>
                                            <Paragraph>
                                                <DatePicker 
                                                    onChange={handleDatePickerChange} 
                                                    placeholder="Select new expiration date"  
                                                    disabledDate={disabledDate}
                                                    customDate={date} 
                                                    defaultValue={newExpiration === null ? null : dayjs(newExpiration)}
                                                    defaultPickerValue={date}
                                                    style={{ width: "70%" }}
                                                >
                                                    Select a new expiration date
                                                </DatePicker>
                                            </Paragraph>
                                        </div>,
                                        () => {
                                            // Using the callback to ensure that newExpiration is updated before calling publishProposalById
                                            if (newExpiration !== null) {
                                                publishProposalById(record, newExpiration);
                                                setNewExpiration(null);
                                            }else{
                                                message.error("Please select a new expiration date");
                                            }
                                        },
                                        "Ok, publish it",
                                        "Cancel",
                                    )
                                }
                            }}
                            disabled={record.status === 'ASSIGNED'}/>
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

    useEffect(() => {
        if (dirty) {
            setIsLoadingTable(true);
            API.getArchivedThesisProposals()
                .then((x) => {
                    setData(handleReceivedData(x));
                    setIsLoadingTable(false);
                    setDirty(false);
                })
                .catch((err) => {
                    message.error(err.message ? err.message : err);
                    setIsLoadingTable(false);
                    setDirty(false);
                });
            API.getClock()
                .then((clock) => {
                    setDate(dayjs().add(clock.offset, 'ms'));
                })
                .catch((err) => { message.error(err.message ? err.message : err) });
        }
    }, [dirty]);

    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

        return formattedData;
    }

    const showModal = (title, content, action, okText, cancelText) => {
        setModalVisible(true);
        Modal.confirm({
            visible: modalVisible,
            title: title,
            icon: <ExclamationCircleFilled />,
            content: content,
            onOk: action,
            okText: okText,
            okType: "danger",
            cancelText: cancelText,
            onCancel: setModalVisible(false)
        });
    };

    const handleDatePickerChange = (date) => {
        const isoFormattedDate = date?.toISOString();
        setNewExpiration(isoFormattedDate); 
    };

    function disabledDate(current) {
        return current && current.valueOf() <= date;
    }

    async function publishProposalById(record, newExpiration) {
        try {
            if(record.status === "ARCHIVED" || record.status === "EXPIRED"){
                await API.publishProposalById(record.id, newExpiration);
                message.success("The proposal has been re-published successfully");
                setDirty(true);
            }
            else{
                message.error("The proposal is already assigned, you cannot re-publish it")
            }
            
        } catch (err) {
            message.error(err.message ? err.message : err);
            setIsLoadingTable(false);
        }
    }


    return (
        <Table {...tableProps} columns={columns} dataSource={data} />
    )
}

export default TeacherArchive;