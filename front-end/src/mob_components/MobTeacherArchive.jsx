import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Modal } from 'antd-mobile';
import { message, Tag, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import API from '../API';
import { useAuth } from '../components/authentication/useAuth';
import { EditOutlined, EyeOutlined, SelectOutlined } from '@ant-design/icons';
import 'flatpickr/dist/themes/material_blue.css';
import proposals from "../routes/Proposals.jsx";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function MobTeacherArchive() {

    const { userData } = useAuth();

    const navigate = useNavigate();

    const [loadArchive, setLoadArchive] = useState(true);

    const [archiveData, setArchiveData] = useState([]);

    const [refreshArchive, setRefreshArchive] = useState(true);

    // Set virtual clock date to prevent filtering for a date before virtual clock one
    const [date, setDate] = useState(dayjs());

    const [newExp, setNewExp] = useState(null);

    const handleExpChange = (date) => {
        const isoDate = date?.toISOString();
        setNewExp(isoDate);
    }

    function disabledDate(current) {
        return current && current.valueOf() <= date;
    }

    async function publishFromArchive(record, newExpiration) {
        try {
            if(record.status === "ARCHIVED" || record.status === "EXPIRED"){
                await API.publishProposalById(record.id, newExpiration);
                message.success("The proposal has been re-published successfully");
                setRefreshArchive(true);
            }
            else{
                message.error("The proposal is already assigned, you cannot re-publish it")
            }

        } catch (err) {
            message.error(err.message ? err.message : err);
            setLoadArchive(false);
        }
    }

    const modalContent = (proposal) => {
        const expDayjs = dayjs(proposal.expiration);
        const selectedDate = expDayjs.isSameOrBefore(date) ? date : expDayjs;
        const expired = proposal.status === "EXPIRED" || (proposal.status === "ARCHIVED" && expDayjs.isBefore(date));
        handleExpChange(expDayjs);
        return (<div>
            <p>Are you sure you want to publish this proposal?</p>
            {expired && <p>If so, select a new expiration date</p>}
            {!expired && <p>You can leave the expiration date unchanged, or change it with another one.</p>}
            <DatePicker
                onChange={handleExpChange}
                placeholder="Select new expiration date"
                disabledDate={disabledDate}
                defaultValue={selectedDate}
                defaultPickerValue={date}
                style={{ width: "70%" }}
            >
                Select a new expiration date
            </DatePicker>
        </div>)
    };


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
                                    <p>Co-supervisors: {x.coSupervisors.map((cSp) => (
                                        <Tag color="blue" key={cSp.id}>
                                            {cSp.name + " " + cSp.surname}
                                        </Tag>
                                    ))}</p>
                                )}
                                <p>Keywords: {x.keywords.map((kw) => (
                                    <Tag color="blue" key={kw}>
                                        {kw}
                                    </Tag>
                                ))}</p>
                                <p>Type: {x.type}</p>
                                <p>Groups: {x.groups.map((gp) => (
                                    <Tag color="blue" key={gp}>
                                        {gp}
                                    </Tag>
                                ))}</p>
                                <p>Expiration: {x.expiration}</p>
                                <p>Status: {x.status}</p>
                                <>
                                    <Button onClick={() => navigate(`/view-proposal/${x.id}`)}><EyeOutlined/>View</Button>
                                    <Button onClick={() => navigate(`/edit-proposal/${x.id}`)}><EditOutlined/>Edit</Button>
                                    {(x.status === 'ARCHIVED' || x.status === 'EXPIRED') && <Button onClick={() => {
                                        Modal.confirm({
                                            title: 'Publish proposal',
                                            content: modalContent(x),
                                            confirmText: 'Ok, publish it',
                                            cancelText: 'Cancel',
                                            confirmButtonProps: {type: 'danger', disabled: newExp === null},
                                            onConfirm: () => {
                                                if (newExp === null && dayjs(x.expiration).isBefore(date)) {
                                                    message.error("Please select a new expiration date");
                                                } else {
                                                    publishFromArchive(x, newExp);
                                                }
                                            },
                                        }
                                    )}}><SelectOutlined/>Publish</Button>}
                                </>

                            </Collapse.Panel>
                        ))}
                    </Collapse>
                </div>
            </div>)}</>);


}



export default MobTeacherArchive;