import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse } from 'antd-mobile';
import { message, Tag, Button } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import API from '../API';
import { useAuth } from '../components/authentication/useAuth';
import { CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import 'flatpickr/dist/themes/material_blue.css';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function MobTeacherThesisProposals() {

    const { userData } = useAuth();

    const navigate = useNavigate();

    const [loadArchive, setLoadArchive] = useState(true);

    const [archiveData, setArchiveData] = useState([]);

    const [refreshArchive, setRefreshArchive] = useState(true);

    // Set virtual clock date to prevent filtering for a date before virtual clock one
    const [date, setDate] = useState(dayjs());



    useEffect(() => {
        if(refreshArchive) {
            setLoadArchive(true);
            API.getArchivedThesisProposals()
                .then((x) => {
                    console.log(x);
                    setArchiveData(handleReceivedArchive(x));
                    setLoadArchive(false);
                    setRefreshArchive(false)
                })
                .catch((err) => {
                    message.error(err.message ? err.message : err);
                    setRefreshArchive(false);
                    setLoadArchive(false);
                });
            API.getClock()
                .then((clock) => {
                    setDate(dayjs().add(clock.offset, 'ms'));
                })
        }
    }, [refreshArchive]);

    function handleReceivedArchive(archiveData) {

        return archiveData.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

    }

    return (<>
        {loadArchive ? (<p>loading</p>) : (
            <div style={{ paddingBottom: "60px", position: "relative" }}>
                <p>{userData? userData.name : ""}, your archived proposals</p>
                <div style={{ marginTop: "5px" }} key={archiveData}>
                    <Collapse accordion >
                        {archiveData.map((x) => (
                            <Collapse.Panel key={x.id} title={x.title}>
                                <p>Level: {x.level}</p>
                                <p>Supervisor: {x.supervisor.name + " " + x.supervisor.surname}</p>
                                {x.coSupervisors && (
                                    <p>Co-supervisors: {x.coSupervisors.map((cosupervisor) => (
                                        <Tag color="blue" key={cosupervisor.id}>
                                            {cosupervisor.name + " " + cosupervisor.surname}
                                        </Tag>
                                    ))}</p>
                                )}
                                <p>Keywords: {x.keywords.map((keyword) => (
                                    <Tag color="blue" key={keyword}>
                                        {keyword}
                                    </Tag>
                                ))}</p>
                                <p>Type: {x.type}</p>
                                <p>Groups: {x.groups.map((group) => (
                                    <Tag color="blue" key={group}>
                                        {group}
                                    </Tag>
                                ))}</p>
                                <p>Expiration: {x.expiration}</p>
                                <>
                                    <Button onClick={() => navigate(`/view-proposal/${x.id}`)}><EyeOutlined/>View</Button>
                                    <Button onClick={() => navigate(`/edit-proposal/${x.id}`)}><EditOutlined/>Edit</Button>
                                </>

                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </div>
            </div>)}</>);


}



export default MobTeacherThesisProposals;