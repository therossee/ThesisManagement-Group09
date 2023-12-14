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

    const [loadData, setLoadData] = useState(true);

    const [thesisData, setThesisData] = useState([]);

    const [refresh, setRefresh] = useState(true);



    useEffect(() => {
        if(refresh) {
            setLoadData(true);
            API.getThesisProposals()
                .then((x) => {
                    setThesisData(handleReceivedData(x));
                    setLoadData(false);
                    setRefresh(false)
                })
                .catch((err) => {
                    message.error(err.message ? err.message : err);
                    setRefresh(false);
                    setLoadData(false);
                });
        }
    }, [refresh]);

    function handleReceivedData(data) {

        return data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

    }

    async function deleteProposal(id) {
        try {
            await API.deleteProposalById(id);
            message.success("Thesis proposal deleted successfully");
            setRefresh(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setLoadData(false);
        }
    }


    async function archiveProposal(id) {
        try {
            await API.archiveProposalById(id);
            message.success("Proposal archived successfully");
            setRefresh(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setLoadData(false);
        }

    }

    return (<>
        {loadData ? (<p>loading</p>) : (
            <div style={{ paddingBottom: "60px", position: "relative" }}>
                <p>{userData? userData.name : ""}, your active proposals</p>
                <div style={{ marginTop: "5px" }} key={thesisData}>
                    <Collapse accordion >
                        {thesisData.map((x) => (
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
                                    <Button onClick={() => deleteProposal(x.id)}><DeleteOutlined/>Delete</Button>
                                    <Button onClick={() => archiveProposal(x.id)}><InboxOutlined/>Archive</Button>
                                </>
                                <Button onClick={() => navigate(`/insert-proposal/${x.id}`)}><CopyOutlined/>Copy</Button>

                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </div>
            </div>)}</>);


}



export default MobTeacherThesisProposals;