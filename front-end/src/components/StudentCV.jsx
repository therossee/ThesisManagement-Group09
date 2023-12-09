import React, { useEffect } from 'react';
import { Drawer } from 'antd';
import API from '../API';

function StudentCV(props) {

    const {isOpen, setIsOpen} = props;

    return (
        <Drawer size="large" open={isOpen} onClose={() => setIsOpen(false)}>
        </Drawer>

    );
}

export default StudentCV;