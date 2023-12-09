import React, { useState, useEffect } from 'react';
import { Avatar, Drawer, Flex, message, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from './authentication/useAuth';
import API from '../API';

function StudentCV(props) {

    const { isOpen, setIsOpen, studentInfo } = props;
    const { Title, Text } = Typography;
    const { accessToken } = useAuth();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            setIsLoading(true);
            API.getStudentCVById(studentInfo.id, accessToken)
                .then((x) => {
                    setIsLoading(false);
                })
                .catch((err) => { message.error(err.message ? err.message : err) });
        }
    }, [accessToken]);

    return (
        <Drawer size="large" open={isOpen} onClose={() => setIsOpen(false)}>
            {isLoading ?
                <Skeleton active />
                :
                <Flex vertical justify="center" align="center">
                    <Avatar icon={<UserOutlined />} size={128} />
                    <Title level={2}>{studentInfo.surname} {studentInfo.name}</Title>
                    <Tag color="#1677ff" style={{ borderRadius: "10px", marginLeft: "5px", marginTop: '-5px' }}>
                        <Text style={{ color: "white" }}>
                            {studentInfo.id}
                        </Text>
                    </Tag>
                </Flex>
            }
        </Drawer>
    );
}

export default StudentCV;