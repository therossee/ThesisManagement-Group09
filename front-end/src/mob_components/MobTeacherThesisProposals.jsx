import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse } from 'antd-mobile';
import { message, Tag, Button } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import API from '../API';
import { useAuth } from '../components/authentication/useAuth';
import 'flatpickr/dist/themes/material_blue.css';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function MobTeacherThesisProposals() {

    const { userData } = useAuth();

    const navigate = useNavigate();

    const [isLoadingTable, setIsLoadingTable] = useState(true);

    const [data, setData] = useState([]);

    const [dirty, setDirty] = useState(true);



    useEffect(() => {
        if(dirty) {
            setIsLoadingTable(true);
            API.getThesisProposals()
                .then((x) => {
                    setData(handleReceivedData(x));
                    setIsLoadingTable(false);
                    setDirty(false)
                })
                .catch((err) => {
                    message.error(err.message ? err.message : err);
                    setDirty(false);
                    setIsLoadingTable(false);
                });
        }
    }, [dirty]);

    function handleReceivedData(data) {

        return data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

    }

    async function deleteProposalById(id) {
        try {
            await API.deleteProposalById(id);
            message.success("Thesis proposal deleted successfully");
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setIsLoadingTable(false);
        }
    }


    async function archiveProposalById(id) {
        try {
            await API.archiveProposalById(id);
            message.success("Proposal archived successfully");
            setDirty(true);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setIsLoadingTable(false);
        }

    }

    return (<>
        {isLoadingTable ? (<p>loading</p>) : (
            <div style={{ paddingBottom: "60px", position: "relative" }}>
                <p>{userData? userData.name : ""}, your active proposals</p>
                <div style={{ marginTop: "5px" }} key={data}>
                    <Collapse accordion >
                        {data.map((x) => (
                            <Collapse.Panel key={x.id} title={x.title}>
                                <p>Level: {x.level}</p>
                                <p>Supervisor: {x.supervisor.name + " " + x.supervisor.surname}</p>
                                {x.coSupervisors && (
                                    <p>Co-supervisors: {x.coSupervisors.map((cosupervisor, i) => (
                                        <Tag color="blue" key={i}>
                                            {cosupervisor.name + " " + cosupervisor.surname}
                                        </Tag>
                                    ))}</p>
                                )}
                                <p>Keywords: {x.keywords.map((keyword, i) => (
                                    <Tag color="blue" key={i}>
                                        {keyword}
                                    </Tag>
                                ))}</p>
                                <p>Type: {x.type}</p>
                                <p>Groups: {x.groups.map((group, i) => (
                                    <Tag color="blue" key={i}>
                                        {group}
                                    </Tag>
                                ))}</p>
                                <p>Expiration: {x.expiration}</p>
                                <>
                                    <Button onClick={() => navigate(`/view-proposal/${x.id}`)}>View</Button>
                                    <Button onClick={() => navigate(`/edit-proposal/${x.id}`)}>Edit</Button>
                                    <Button onClick={() => deleteProposalById(x.id)}>Delete</Button>
                                    <Button onClick={() => archiveProposalById(x.id)}>Archive</Button>
                                </>
                                <Button onClick={() => navigate(`/insert-proposal/${x.id}`)}>Copy</Button>

                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </div>
            </div>)}</>);


}



export default MobTeacherThesisProposals;