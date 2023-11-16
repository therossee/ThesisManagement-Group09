import { React, useState, useEffect } from "react";
import API from "../API";
import { Divider, List, Skeleton, Avatar, Button, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function ThesisApplications() {
    const [data, setData] = useState([]);
    const [studentApplications, setStudentApplications] = useState({});
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const proposals = await API.getTeacherThesisProposals();
                setData(proposals);
                setIsLoadingTable(false);

                // Carica le richieste degli studenti per ciascuna tesi
                const studentApplicationsData = {};
                await Promise.all(
                    proposals.map(async (proposal) => {
                        const students = await API.getTeacherThesisApplications(proposal.id);
                        studentApplicationsData[proposal.id] = Array.isArray(students) ? students : [];
                    })
                );
                setStudentApplications(studentApplicationsData);
            } catch (error) {
                /* Gestione errore con messaggio */
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {data.map((item) => (
                <div key={item.id}>
                    <Divider orientation="left">{item.title}</Divider>
                    <List
                        className="demo-loadmore-list"
                        loading={isLoadingTable}
                        itemLayout="horizontal"
                        dataSource={studentApplications[item.id] || []}
                        renderItem={(student) => (
                            <List.Item key={student.id}>
                                <Skeleton loading={isLoadingTable} avatar title={true} active>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={`${student.surname} ${student.name}`}
                                        description={student.status}
                                    />
                                    <Flex wrap="wrap" gap="small">
                                        <Button type="primary">Approva</Button>
                                        <Button danger>Rifiuta</Button>
                                    </Flex>

                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </>
    );
}


export { ThesisApplications };