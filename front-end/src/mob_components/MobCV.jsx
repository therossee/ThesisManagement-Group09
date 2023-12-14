import React, { useState, useEffect } from 'react';
import { Avatar, Col, Drawer, Flex, message, Row, Skeleton, Tag, Typography, Button } from 'antd';
import { Popup, Collapse } from 'antd-mobile';
import { UserOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import API from '../API';
function MobCV(props) {
    const { isVisible, setIsVisible, studentInfo, applicationId } = props;
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
        <Popup
            visible={isVisible}
            onClose={() => setIsVisible(false)}
            animationType="slide-up"
        >
            {isLoading ?
                <Skeleton active />
                :
                <>
                    <Flex vertical justify="center" align="center">
                        <h3>Color legend for marks:</h3>
                        <ColorLegenda />
                        <Avatar icon={<UserOutlined />} size={64} />
                        <h4 style={{ marginTop: '15px' }}>{studentInfo.surname} {studentInfo.name}</h4>
                        <Tag color="#1677ff" style={{ borderRadius: "10px", marginLeft: "4px", marginTop: '-7px' }}>
                            <Text style={{ color: "white" }}>
                                {studentInfo.id}
                            </Text>
                        </Tag>
                        <Button style={{marginTop: "5px"}} disabled={!file} onClick={() => openPDF({ file })}>View attached PDF</Button>
                    </Flex>
                    <Collapse style={{marginTop: "2%"}}>
                    {data.length > 0 ?
                        <>
                            {data.map((x) => {
                                const title = x.code + " - " + x.teaching;
                                // <Collapse.Panel
                                return (<Collapse.Panel
                                key={x.code} title={title}>
                                    <h4>Taken in</h4><p>{x.date}</p>
                                    <h4>Mark</h4>
                                    <Tag color={color(x.mark)} style={{ borderRadius: "20px" }}>
                                        <Text style={{ color: "white" }}>
                                            {x.mark}
                                        </Text>
                                    </Tag>

                                </Collapse.Panel>);
                                })}
                        </>
                        :
                        <Flex vertical style={{ justify: "center", align: "center", marginTop: "30px" }}>
                            <Title level={5}>No Exams found</Title>
                        </Flex>
                    }
                    </Collapse>
                </>
            }
        </Popup>
    )
}

function ColorLegenda() {
    return (
        <Row style={{ marginBottom: '10px', marginLeft: "3%", marginRight: "3%", marginTop: "3%" }}>
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


MobCV.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    studentInfo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired
}),
    applicationId: PropTypes.number.isRequired,
}

openPDF.propTypes = {
    file: PropTypes.object.isRequired,
}

export default MobCV;