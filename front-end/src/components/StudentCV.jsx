import React, { useState, useEffect } from 'react';
import { Avatar, Col, Drawer, Flex, message, Row, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAuth } from './authentication/useAuth';
import API from '../API';

function StudentCV(props) {

    const { isOpen, setIsOpen, studentInfo } = props;
    const { Title, Text } = Typography;
    const { accessToken } = useAuth();

    const [isLoading, setIsLoading] = useState(true);

    // Store exams info
    const [data, setData] = useState(true);

    useEffect(() => {
        if (accessToken) {
            setIsLoading(true);
            API.getStudentCVById(studentInfo.id, accessToken)
                .then((x) => {
                    setIsLoading(false);
                    setData(x);
                })
                .catch((err) => {
                    message.error(err.message ? err.message : err);
                    setIsLoading(false);
                });
        }
    }, [accessToken]);

    function color(mark) {
        return (
            mark < 20 ? "#f5222d" : // 18-19
                mark < 22 ? "#fa8c16" : // 20-21
                    mark < 24 ? "#fadb14" : // 22-23
                        mark < 27 ? "#a0d911" : // 24-26
                            mark < 31 ? "#52c41a" : // 27-30
                                "#bfbfbf" // default color
        )
    }

    function ColorLegenda() {
        return (
            <Row style={{ marginBottom: '40px' }}>
                <Tag color="#f5222d">Less than 20</Tag>
                <Tag color="#fa8c16">20 to 21</Tag>
                <Tag color="#fadb14">22 to 23</Tag>
                <Tag color="#a0d911">24 to 26</Tag>
                <Tag color="#52c41a">27 and above</Tag>
            </Row>
        )
    }

    return (
        <Drawer size="large" open={isOpen} onClose={() => setIsOpen(false)}>
            {isLoading ?
                <Skeleton active />
                :
                <>
                    <Flex vertical justify="center" align="center">
                        <ColorLegenda />
                        <Avatar icon={<UserOutlined />} size={128} />
                        <Title level={2} style={{ marginTop: '15px' }}>{studentInfo.surname} {studentInfo.name}</Title>
                        <Tag color="#1677ff" style={{ borderRadius: "10px", marginLeft: "4px", marginTop: '-7px' }}>
                            <Text style={{ color: "white" }}>
                                {studentInfo.id}
                            </Text>
                        </Tag>
                    </Flex>
                    {data.length > 0 ?
                        <>
                            <Row style={{ marginTop: '30px' }}>
                                <Col span={4}><Text strong>Date <ArrowDownOutlined /></Text></Col>
                                <Col span={3}><Text strong>Code</Text></Col>
                                <Col span={14}><Text strong>Teaching</Text></Col>
                                <Col span={2}><Text strong>Mark</Text></Col>
                                <Col span={1}><Text strong>CFU</Text></Col>
                            </Row>
                            {data.map((x, index) => (
                                <Row key={index} style={{ marginTop: '8px' }}>
                                    <Col span={4}><Text type="secondary">{x.date}</Text></Col>
                                    <Col span={3}><Text type="secondary">{x.code}</Text></Col>
                                    <Col span={14}><Text>{x.teaching}</Text></Col>
                                    <Col span={2}>
                                        <Tag color={color(x.mark)} style={{ borderRadius: "20px" }}>
                                            <Text style={{ color: "white" }}>
                                                {x.mark}
                                            </Text>
                                        </Tag>
                                    </Col>
                                    <Col span={1}><Text type="secondary">{x.cfu}</Text></Col>
                                </Row>
                            ))}
                        </>
                        :
                        <Flex vertical justify="center" align="center" marginTop='30px'>
                            <Title level={5}>No Exams found</Title>
                        </Flex>
                    }
                </>
            }
        </Drawer >
    );
}

export default StudentCV;