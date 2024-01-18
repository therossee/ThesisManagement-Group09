import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Modal, Space, Table, Tooltip, Typography } from 'antd';
import { CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';
import { generateCommonColumns } from './utils';
import API from '../API';

function TeacherThesisProposals() {

    // Array of objs for storing table data
    const [data, setData] = useState([]);

    // Loading table data fetching
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    const navigate = useNavigate();

    const [dirty, setDirty] = useState(true);

    const { Paragraph, Text } = Typography;

    // Columns of the table
    const columns = [
        ...generateCommonColumns(),
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
                    <Tooltip title="Copy Proposal">
                        <CopyOutlined style={{ fontSize: '20px' }} onClick={() => navigate(`/insert-proposal/${record.id}`)} />
                    </Tooltip>
                    <Tooltip title="Delete Proposal">
                        <DeleteOutlined
                            style={{ fontSize: '20px' }}
                            onClick={() => showModal(
                                <div>
                                    <Paragraph>
                                        <Text strong>
                                            Are you sure you want to delete this thesis proposal?
                                        </Text>
                                    </Paragraph>
                                    <Paragraph>
                                        <Text strong>Thesis title: </Text><Text>{record.title}</Text>
                                    </Paragraph>
                                </div>,
                                () => deleteProposalById(record.id),
                                "Yes, delete it",
                                "No, keep it"
                            )}
                        />
                    </Tooltip>
                    <Tooltip title="Archive Proposal">
                        <InboxOutlined
                            style={{ fontSize: '20px' }}
                            onClick={() => showModal(
                                <div>
                                    <Paragraph>
                                        <Text strong>
                                            Are you sure you want to archive this thesis proposal?
                                        </Text>
                                    </Paragraph>
                                    <Paragraph>
                                        <Text strong>Thesis title: </Text><Text>{record.title}</Text>
                                    </Paragraph>
                                </div>,
                                () => archiveProposalById(record.id),
                                "Yes, archive it",
                                "No, keep it"
                            )}
                        />
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

    const showModal = (content, action, okText, cancelText) => {
        Modal.confirm({
            title: "Confirm action",
            icon: <ExclamationCircleFilled />,
            content: content,
            onOk: action,
            okText: okText,
            okType: "danger",
            cancelText: cancelText,
        });
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
        return data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));
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
