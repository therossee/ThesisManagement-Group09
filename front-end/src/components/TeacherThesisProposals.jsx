import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, message, Space, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import API from '../API';

function TeacherThesisProposals() {

    // Array of objs for storing table data
    const [data, setData] = useState([])

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);


    const navigate = useNavigate();

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
                        <Popconfirm 
                        title="Are you sure you want to delete this proposal?" 
                        onConfirm={() => deleteProposalById(record.id)} 
                        okText="Yes" 
                        cancelText="No"
                        >
                         <DeleteOutlined style={{ fontSize: '20px' }} />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Archive Proposal">
                        <Popconfirm
                            title="Confirm action"
                            placement="left"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            description="Are you sure you want to archive this proposal?"
                            cancelText="No"
                            okText="Yes"
                            onConfirm={() => archiveProposalById(record.id)}
                            onCancel={() => { }}
                            >
                            <InboxOutlined style={{ fontSize: '20px' }} />
                        </Popconfirm>
                    </Tooltip>



                </Space >
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
            API.getThesisProposals()
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

    async function deleteProposalById(id) {
        try {
            await API.deleteProposalById(id);
            message.success("Thesis proposal deleted successfully");
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setIsLoadingTable(false);
        }
    }


    async function archiveProposalById(id) {
        console.log(id);
        try {
            await API.archiveProposalById(id);
            message.success("Proposal archived successfully");
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