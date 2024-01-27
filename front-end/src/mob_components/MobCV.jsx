import React, { useState, useEffect } from 'react';
import { Avatar, Flex, message, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Collapse, Button, AutoCenter} from 'antd-mobile';
import PropTypes from 'prop-types';
import API from '../API';
function MobCV(props) {
    const { setTab, studentInfo, applicationId } = props;
    const { Title, Text } = Typography;
    const [loadData, setLoadData] = useState(true);
    // Store exams info
    const [examCV, setExamCV] = useState([]);
    // Store optional PDF
    const [file, setFile] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadData(true);
                const exams = await API.getStudentCVById(studentInfo.id);
                setExamCV(exams);
                const pdf = await API.getPDF(studentInfo.id, applicationId);
                setFile(pdf);
            } catch (err) {
                message.error(err.message ?? err);
            } finally {
                setLoadData(false);
            }
        };
        fetchData();
    }, []);

    function setColor(mark) {
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
        <>
            {loadData ?
                <Skeleton active />
                :
                <>
                    <Flex vertical justify="center" align="center">
                        <h3>Color legend for marks:</h3>
                        <ColorLegenda />
                        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} size={64} />
                        <h4 style={{ marginTop: '15px' }}>{studentInfo.surname} {studentInfo.name}</h4>
                        <Tag color="#1677ff" style={{ borderRadius: "10px", marginLeft: "4px", marginTop: '-12px' }}>
                            <Text style={{ color: "white" }}>
                                {studentInfo.id}
                            </Text>
                        </Tag>
                        <Button style={{marginTop: "5px"}} disabled={!file} onClick={() => openPDF({ file })}>View attached PDF</Button>
                    </Flex>
                    {examCV.length > 0 ?
                            <Collapse style={{marginTop: "2%"}}>
                            {examCV.map((x) => {
                                const title = x.code + " - " + x.teaching;
                                // <Collapse.Panel
                                return (<Collapse.Panel
                                key={x.code} title={title}>
                                    <h4>Taken in</h4><p>{x.date}</p>
                                    <h4>Mark</h4>
                                    <Tag color={setColor(x.mark)} style={{ borderRadius: "20px" }}>
                                        <Text style={{ color: "white", size: "16px" }}>
                                            {x.mark}
                                        </Text>
                                    </Tag>

                                </Collapse.Panel>);
                                })}
                        </Collapse>
                        :
                        <Flex vertical style={{ justify: "center", align: "center", marginTop: "30px" }}>
                            <Title level={5}>No Exams found</Title>
                        </Flex>
                    }
                    <AutoCenter>
                    <div style={{marginTop: "2%", paddingBottom: "60px", alignItems: "center"}}>
                        <Button type="primary"  onClick={() => setTab("list")}>Close</Button>
                    </div>
                    </AutoCenter>
                </>
            }
        </>
    )
}

function ColorLegenda() {
    return (
        <>
        <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
            <Tag color="#f5222d">Less than 20</Tag>
            <Tag color="#fa8c16">20 to 21</Tag>
            <Tag color="#fadb14">22 to 23</Tag>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: '5px', marginBottom: '10px'}}>
            <Tag color="#a0d911">24 to 26</Tag>
            <Tag color="#52c41a">27 and above</Tag>
        </div>
        </>
    )
}

function openPDF(props) {
    const url = URL.createObjectURL(props.file);
    window.open(url, '_blank');
}


MobCV.propTypes = {
    setTab: PropTypes.func.isRequired,
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