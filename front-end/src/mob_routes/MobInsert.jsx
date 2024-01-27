import React from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function MobInsert(){
    const navigate = useNavigate();
    return <FileAddOutlined onClick={() => navigate("/insert-proposal")} />
}

export default MobInsert;
