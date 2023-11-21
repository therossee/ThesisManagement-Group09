import React, { useState, useEffect } from 'react';
import { message, Space, Table, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import API from '../API';

function TeacherThesisProposals() {

    // Array of objs for storing table data
    const [data, setData] = useState([])

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    // Storing message errors
    const [messageApi, messageBox] = message.useMessage();

    // Columns of the table
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            fixed: 'left',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            sorter: (a, b) => a.level.localeCompare(b.level),
        },
        {
            title: 'Co-Supervisors',
            dataIndex: 'coSupervisors',
            render: (_, x) => x.coSupervisors.map((cosupervisor, i) => (
                <Tag color="blue" key={i}>
                    {cosupervisor.name + " " + cosupervisor.surname}
                </Tag>
            )),
        },
        {
            title: 'Keywords',
            dataIndex: 'keywords',
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
        },
        {
            title: 'Groups',
            dataIndex: 'groups',
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
                    <Tooltip title="Edit Proposal">
                        <EditOutlined style={{ fontSize: '20px' }} onClick={() => navigate(`/edit-proposal/${record.id}`)} />
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
        API.getThesisProposals()
            .then((x) => {
                setData(handleReceivedData(x));
                setIsLoadingTable(false);
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
    }, []);

    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

        return formattedData;
    }

    return (
        <>
            {messageBox}
            <Table {...tableProps} columns={columns} dataSource={data} />
        </>
    )
}

export default TeacherThesisProposals;