import React, { useState, useEffect } from 'react';
import { Avatar, Col, Drawer, Flex, message, Row, Skeleton, Tag, Typography, Button } from 'antd';
import { UserOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import API from '../API';

function StudentCV(props) {

    const URL = 'http://localhost:3000';

    const { isOpen, setIsOpen, studentInfo, applicationId } = props;
    const { Title, Text } = Typography;

    const [isLoading, setIsLoading] = useState(true);

    // Store exams info
    const [data, setData] = useState(true);

    // Store optional PDF
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const exams = await API.getStudentCVById(studentInfo.id);
                setData(exams);
                const pdf = await API.getPDF(studentInfo.id, applicationId);
                setFile(pdf);
            } catch (err) {
                message.error(err.message ? err.message : err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    function color(mark) {
        let colorCode;
        if (mark < 20) {
            colorCode = "#f5222d";
        } else if (mark < 22) {
            colorCode = "#fa8c16";
        } else if (mark < 24) {
            colorCode = "#fadb14";
        } else if (mark < 27) {
            colorCode = "#a0d911";
        } else {
            colorCode = "#52c41a";
        }
        return colorCode;
    }

    return (
        <Drawer
            size="large"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            extra={
                <Button disabled={!file} onClick={() => openPDF({file})}>View attached PDF</Button>
            }>
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
                            {data.map((x) => (
                                <Row key={x.code} style={{ marginTop: '8px' }}>
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
                        <Flex vertical style={{ justify: "center", align: "center", marginTop: "30px" }}>
                            <Title level={5}>No Exams found</Title>
                        </Flex>
                    }
                </>
            }
        </Drawer >
    );
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

function openPDF(props) {
    const url = URL.createObjectURL(props.file);
    window.open(url, '_blank');
}

StudentCV.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    applicationId: PropTypes.number.isRequired,
    studentInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }),
}

openPDF.propTypes = {
    file: PropTypes.object.isRequired,
}

export default StudentCV;