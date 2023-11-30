import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Space, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import API from '../API';
import { useAuth } from './authentication/useAuth';

function TeacherThesisProposals() {

    // Array of objs for storing table data
    const [data, setData] = useState([])

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    const navigate = useNavigate();

    const { accessToken } = useAuth();

    const [dirty, setDirty] = useState(true);

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
            title: 'CdS',
            dataIndex: 'CdS',
            render: (_, x) => x.cds.map((cds, i) => (
                <Tag color="blue" key={i}>
                    {cds.title_degree}
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
                    <Tooltip title="Delete Proposal">
                        <DeleteOutlined style={{ fontSize: '20px' }} onClick={()=> deleteProposalById(record.id)} />
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
        if (accessToken && dirty) {
            setIsLoadingTable(true);
            API.getThesisProposals(accessToken)
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
        }
    }, [accessToken, dirty]);

    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

        return formattedData;
    }

    async function deleteProposalById(id) {
        try {
            await API.deleteProposalById(id, accessToken);
            message.success("Deleted proposal " + id);
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setIsLoadingTable(false);
        }
    }

    return (
        <Table {...tableProps} columns={columns} dataSource={data} />
    )
}

export default TeacherThesisProposals;