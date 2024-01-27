import { Tag } from 'antd';

// Common function to generate columns
export function generateCommonColumns() {
    return [
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
            render: (_, x) => x.coSupervisors.map(cosupervisor => (
                <Tag color="blue" key={cosupervisor.name + " " + cosupervisor.surname}>
                    {cosupervisor.name + " " + cosupervisor.surname}
                </Tag>
            )),
        },
        {
            title: 'Keywords',
            dataIndex: 'keywords',
            render: (_, x) => x.keywords.map(keyword => (
                <Tag color="blue" key={keyword}>
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
            render: (_, x) => x.groups.map(group => (
                <Tag color="blue" key={group}>
                    {group}
                </Tag>
            )),
        },
        {
            title: 'CdS',
            dataIndex: 'CdS',
            render: (_, x) => x.cds.map(cds => (
                <Tag color="blue" key={cds.title_degree}>
                    {cds.title_degree}
                </Tag>
            )),
        },
        {
            title: 'Expiration',
            dataIndex: 'expiration',
            sorter: (a, b) => new Date(a.expiration) - new Date(b.expiration),
        },
    ];
}

export function getStatus(status) {
    switch (status) {
        case "accepted by secretary":
            return <Badge status="processing" text={<strong>Waiting for your approval</strong>} />;
        case "changes requested":
            return <Badge status="warning" text={<strong>Changes requested</strong>} />;
        case "rejected by teacher":
            return <Badge status="error" text={<strong>Rejected by you</strong>} />;
        case "accepted by teacher":
            return <Badge status="success" text={<strong>Accepted by you</strong>} />;
        default:
            return <Badge status="error" text={<strong>Failed fetching/parsing information</strong>} />
    }
}
