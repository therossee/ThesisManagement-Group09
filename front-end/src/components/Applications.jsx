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
    }, [isLoadingTable]);

    const acceptApplication = async (proposalId, studentId) => {
        console.log('Accepting application for proposal_id:', proposalId, 'and student_id:', studentId);
        try {
            setIsLoadingTable(true)
            const response = await API.acceptThesisApplications(proposalId, studentId);
            console.log('API response:', response);
            if (response.success) {
                setIsLoadingTable(false)
            } else {
                const rowElement = document.getElementById(`student-row-${studentId}`);
                rowElement.classList.add('error-row');

                setTimeout(() => {
                    rowElement.classList.remove('error-row');
                }, 1000);
            }
        } catch (error) {
            console.error('API error:', error);
            const rowElement = document.getElementById(`student-row-${studentId}`);
            rowElement.classList.add('error-row');

            setTimeout(() => {
                rowElement.classList.remove('error-row');
            }, 1000);
        }
    };

    const rejectApplication = async (proposalId, studentId) => {
        console.log('Rejecting application for proposal_id:', proposalId, 'and student_id:', studentId);
        try {
            setIsLoadingTable(true)
            const response = await API.rejectThesisApplications(proposalId, studentId);
            console.log('API response:', response);
            if (response.success) {
                setIsLoadingTable(false)
            } else {
                const rowElement = document.getElementById(`student-row-${studentId}`);
                rowElement.classList.add('error-row');

                setTimeout(() => {
                    rowElement.classList.remove('error-row');
                }, 1000);
            }
        } catch (error) {
            console.error('API error:', error);
            const rowElement = document.getElementById(`student-row-${studentId}`);
            rowElement.classList.add('error-row');

            setTimeout(() => {
                rowElement.classList.remove('error-row');
            }, 1000);
        }
    };



    return (
        <>
            {data.map((item) => (
                <div key={item.id} style={{marginBottom: "3%"}}>
                    <Divider orientation="left"><h2>{item.title}</h2></Divider>
                    <List
                        className="demo-loadmore-list"
                        loading={isLoadingTable}
                        itemLayout="horizontal"
                        dataSource={studentApplications[item.id] || []}
                        renderItem={(student) => (
                            <List.Item key={student.id} id={`student-row-${student.id}`} style={{ backgroundColor: student.status === 'accepted' ? 'lightgreen' : 'inherit' }}>
                                <Skeleton loading={isLoadingTable} avatar title={true} active>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={`${student.surname} ${student.name}`}
                                        description={student.status}
                                    />
                                    {student.status === 'waiting for approval' ? (
                                        <Flex wrap="wrap" gap="small">
                                            <Button onClick={() => acceptApplication(item.id, student.id)} type="primary">Approve</Button>

                                            <Button onClick={() => rejectApplication(item.id, student.id)} danger>Reject</Button>
                                        </Flex>
                                    ): null}
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