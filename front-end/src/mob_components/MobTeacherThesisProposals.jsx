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
import PropTypes from 'prop-types';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function MobTeacherThesisProposals() {

    const { userData } = useAuth();

    const [messageApi, messageBox] = message.useMessage();

    const [clock, setClock] = useState(dayjs());

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);


    useEffect(() => {
        API.getClock()
            .then((x) => {
                setClock(dayjs().add(x.offset, 'ms'));
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
        API.getThesisProposals()
            .then((x) => {
                console.log(x);
                setData(handleReceivedData(x));
            }).finally(() => setIsLoading(false))
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
    }, []);


    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));
        console.log(formattedData);

        return formattedData;
    }

    return (
        <>        
        {isLoading ? (<p>loading</p>) : (
                    <div style={{ paddingBottom: "60px", position: "relative" }}>
                        {messageBox}
                        <p>{userData? userData.name : ""}, your active proposals</p>
                        <CustomCollapse data={data} />
                    </div>
                )}
        </>
    
    )
}

function CustomCollapse(props) {
    const navigate = useNavigate();
    const data = props.data;
    return (
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
                        <Button onClick={() => navigate(`/view-proposal/${x.id}`)}>View this proposal</Button>
                        <Button onClick={() => navigate(`/edit-proposal/${x.id}`)}>Edit this proposal</Button>
                    </Collapse.Panel>
                ))}
            </Collapse>
        </div>);
}

CustomCollapse.propTypes = {
    data: PropTypes.array.isRequired,
};

export default MobTeacherThesisProposals;