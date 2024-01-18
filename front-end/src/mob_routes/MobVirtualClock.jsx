import React from 'react';
import { SettingFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function MobVirtualClock(){
    const navigate = useNavigate();
    return <SettingFilled onClick={() => navigate("/admin/virtual-clock")} />
}

export default MobVirtualClock;

