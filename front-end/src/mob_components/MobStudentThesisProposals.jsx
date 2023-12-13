import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Collapse, JumboTabs, Selector, TextArea, Form } from 'antd-mobile';
import { message, Tag, Button } from 'antd';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import API from '../API';
import 'flatpickr/dist/themes/material_blue.css';
import PropTypes from 'prop-types';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function MobStudentThesisProposals() {

    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const flatpickrRef = useRef(null);

    const [messageApi, messageBox] = message.useMessage();

    const [clock, setClock] = useState(dayjs());

    // Array of objs for storing table data
    const [data, setData] = useState([]);

    const [filteredData, setFilteredData] = useState([]);
    const [levels, setLevels] = useState([]);

    // Loading table data fetching
    const [isLoading, setIsLoading] = useState(true);
    const [resetTrigger, setResetTrigger] = useState(false);

    // Storing Title Search filter
    const [searchTitle, setSearchTitle] = useState('');
    const [supervisors, setSupervisors] = useState([]);
    const [coSupervisors, setCoSupervisors] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [types, setTypes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [knowledge, setKnowledge] = useState('');
    const [dateRange, setDateRange] = useState([]);

    const handleDateChange = (dates) => {
        setDateRange(dates);
    }

    useEffect(() => {
        API.getClock()
            .then((x) => {
                setClock(dayjs().add(x.offset, 'ms'));
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
        API.getThesisProposals()
            .then((x) => {
                setData(handleReceivedData(x));
                setFilteredData(handleReceivedData(x));
                setIsLoading(false);
            })
            .catch((err) => { messageApi.error(err.message ? err.message : err) });
    }, []);


    function handleReceivedData(data) {

        const formattedData = data.map((x) => ({
            // Take all fields from API.jsx
            ...x,
            // Concatenate internal/external co-supervisors
            coSupervisors: [].concat(x.internalCoSupervisors, x.externalCoSupervisors),
        }));

        return formattedData;
    }

    const applyFilters = () => {
        let filteredResults = [...data];

        // Priority 1: Filter for "Title"
        if (searchTitle) {
            filteredResults = filteredResults.filter(item => item.title.toLowerCase().includes(searchTitle.toLowerCase()));
        }

        // Priority 2: Filter for "Supervisors"
        if (supervisors && supervisors.length > 0) {
            const ids = supervisors.map(item => item.value);
            filteredResults = filteredResults.filter(item => ids.includes(item.supervisor.id));
        }

        // Priority 3: Filter for "Co-Supervisors"
        if (coSupervisors && coSupervisors.length > 0) {
            const ids = coSupervisors.map(item => item.value);
            filteredResults = filteredResults.filter(item => 
                item.coSupervisors.some(coSupervisor => ids.includes(coSupervisor.id)));
        }

        // Priority 4: Filter for "Keywords"
        if (keywords && keywords.length > 0) {
            const kw = keywords.map(keyword => keyword.value);
            filteredResults = filteredResults.filter(item => 
                item.keywords.some(keyword => kw.includes(keyword)));
        }

        // Priority 5: Filter for "Type"
        if (types && types.length > 0) {
            const tp = types.map(type => type.value);
            filteredResults = filteredResults.filter(item => tp.includes(item.type));
        }

        //Priority 6: Filter for "Groups"
        if (groups && groups.length > 0) {
            const ids = groups.map(group => group.value);
            filteredResults = filteredResults.filter(item => 
                item.groups.some(group => ids.includes(group.id)));
        }

        if (dateRange && dateRange.length > 1) {
            const date0 = dayjs(dateRange[0]);
            const date1 = dayjs(dateRange[1]);
            filteredResults = filteredResults.filter(item => {
                const expiration = dayjs(item.expiration);
                return expiration.isSameOrAfter(date0) && expiration.isSameOrBefore(date1);
            });
        }

        // Filter for "Description"
        if (description) {
            filteredResults = filteredResults.filter(item => item.description.toLowerCase().includes(description.toLowerCase()));
        }

        // Filter for "Knowledge"
        if (knowledge) {
            filteredResults = filteredResults.filter(item => item.requiredKnowledge.toLowerCase().includes(knowledge.toLowerCase()));
        }

        // Filter for "Notes"
        if (notes) {
            filteredResults = filteredResults.filter(item => item.notes.toLowerCase().includes(notes.toLowerCase()));
        }
        const uniqueIds = new Set();
        filteredResults = filteredResults.filter(item => {
            if (uniqueIds.has(item.id)) {
                return false; // Duplicate, skip
            }
            uniqueIds.add(item.id);
            return true; // Not a duplicate, include in results
        });
        setFilteredData(filteredResults);
    };

    const handleReset = () => {
        setSearchTitle('');
        setLevels([]);
        setSupervisors([]);
        setCoSupervisors([]);
        setKeywords([]);
        setTypes([]);
        setGroups([]);
        setDescription('');
        setKnowledge('');
        setNotes('');
        form.resetFields();
        form2.resetFields();
        setFilteredData(data);

    }

    return (
        <JumboTabs>
            <JumboTabs.Tab title='Proposals' key='list-proposals'>
                <>
                    <div style={{ paddingBottom: "60px", position: "relative" }}>
                        {messageBox}
                        <p>Active proposals for your CdS</p>
                        <CustomCollapse filteredData={filteredData} />
                    </div>
                </>
            </JumboTabs.Tab>
            <JumboTabs.Tab title='Filters' key='filters'>
                <Form
                    form={form}
                    onFinish={applyFilters}
                    layout='horizontal'
                >
                    <Form.Item>
                        Title
                        <Input clearable name='searchTitle' placeholder="Insert here" value={searchTitle} onChange={e => { setSearchTitle(e); }} />
                    </Form.Item>
                    <Collapse accordion>
                    <Collapse.Panel key="level" title="Level">
                    <Form.Item>
                        <Selector options={data.reduce((accumulator, x) => {
                            // Check if there is alreadythe obj
                            const existingObject = accumulator.find(item => item.value === x.level);
                            // If not found add it
                            if (!existingObject) {
                                accumulator.push({
                                    label: x.level,
                                    value: x.level,
                                });
                            }
                            return accumulator;
                        }, [])} placeholder="Level" onChange={(arr, extend) => setLevels(...arr, extend.items)}
                            multiple key={resetTrigger}/>
                    </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel key="supervisors" title="Supervisors">
                    <Form.Item>
                        <Selector options={data.reduce((accumulator, x) => {
                            // Check if there is already the obj
                            const existingObject = accumulator.find(item => item.value === x.supervisor.id);
                            // If not add it
                            if (!existingObject) {
                                accumulator.push({
                                    label: x.supervisor.name + " " + x.supervisor.surname,
                                    value: x.supervisor.id,
                                });
                            }
                            return accumulator;
                        }, [])} placeholder="Supervisor" onChange={(arr, extend) =>{
                            setSupervisors(extend.items)
                        }
                        }
                            multiple
                            key={resetTrigger} />
                    </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel key="co-supervisors" title="Co-Supervisors">
                    <Form.Item>
                        <Selector options={data.reduce((accumulator, x) => {
                            x.coSupervisors.forEach(cosupervisor => {
                                // Check if there is already the obj
                                const existingObject = accumulator.find(item => item.value === cosupervisor.id);
                                // If not add it
                                if (!existingObject) {
                                    accumulator.push({
                                        label: cosupervisor.name + " " + cosupervisor.surname,
                                        value: cosupervisor.id,
                                    });
                                }
                            });
                            return accumulator;
                        }, [])} placeholder="Co-supervisors" onChange={(arr, extend) => {setCoSupervisors(extend.items)}}
                            multiple
                            key={resetTrigger} />
                    </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel title="Keywords" key="keywords">
                    <Form.Item>
                        Keywords
                        <Selector multiple options={data.reduce((accumulator, x) => {
                            x.keywords.forEach(keyword => {
                                // Check if there is already the obj
                                const existingObject = accumulator.find(item => item.value === keyword);
                                // If not add it
                                if (!existingObject) {
                                    accumulator.push({
                                        label: keyword,
                                        value: keyword,
                                    });
                                }
                            });
                            return accumulator;
                        }, [])} placeholder="Keywords" onChange={(arr, extend) => setKeywords(extend.items)}
                            key={resetTrigger} />
                    </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel key="types" title="Types">
                    <Form.Item>
                        Types
                        <Selector
                            multiple
                            options={data.reduce((accumulator, x) => {
                                // Check if there is alreadythe obj
                                const existingObject = accumulator.find(item => item.value === x.type);
                                // If not found add it
                                if (!existingObject) {
                                    accumulator.push({
                                        label: x.type,
                                        value: x.type,
                                    });
                                }
                                return accumulator;
                            }, [])} placeholder="Type" onChange={(arr, extend) => setTypes(extend.items)}
                            key={resetTrigger} />
                    </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel key="groups" title="Groups">
                    <Form.Item>
                        Groups
                        <Selector multiple options={data.reduce((accumulator, x) => {
                            x.groups.forEach(group => {
                                // Check if there is already the obj
                                const existingObject = accumulator.find(item => item.value === group);
                                // If not add it
                                if (!existingObject) {
                                    accumulator.push({
                                        label: group,
                                        value: group,
                                    });
                                }
                            });
                            return accumulator;
                        }, [])} placeholder="Groups" onChange={(arr, extend) => setGroups(extend.items)}
                            key={resetTrigger} />
                    </Form.Item>
                    </Collapse.Panel>
                    </Collapse>
                    <Form.Item>
                        Expiration interval
                        <div>
                            <Flatpickr
                                options={{
                                    mode: 'range',
                                    dateFormat: 'm-d-Y',
                                    onChange: handleDateChange,
                                }}
                                ref={flatpickrRef}
                            />
                        </div>
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '80px' }}>
                        <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">
                            Submit filters
                        </Button>
                        <Button type="default" onClick={() => {
                            form.resetFields();
                            flatpickrRef.current.flatpickr.clear();
                            handleReset();
                            setResetTrigger(prev => !prev);
                        }}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </JumboTabs.Tab>
            <JumboTabs.Tab title='More...' key='moreFilters'>
                <Form
                    form={form2}
                >
                    <Form.Item>
                        Description
                        <TextArea placeholder="Insert here" rows={5} value={description} onChange={e => setDescription(e)} />
                    </Form.Item>
                    <Form.Item>
                        Required knowledge
                        <TextArea placeholder="Insert here" rows={3} value={knowledge} onChange={e => setKnowledge(e)} />
                    </Form.Item>
                    <Form.Item>
                        Notes
                        <TextArea placeholder="Insert here" rows={3} value={notes} onChange={e => setNotes(e)} />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '60px' }}>
                        <Button style={{ marginRight: '10px' }} type="primary" onClick={applyFilters}>
                            Submit filters
                        </Button>
                        <Button type="default" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </JumboTabs.Tab>
        </JumboTabs>
    )
}

function CustomCollapse(props) {
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState(props.filteredData);

    useEffect(() => {
        setFilteredData(props.filteredData);
    }, [props])

    return (
        <div style={{ marginTop: "5px" }} key={props.filteredData}>
            <Collapse accordion >
                {filteredData.map((x) => (
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
                    </Collapse.Panel>
                ))}
            </Collapse>
        </div>);
}

CustomCollapse.propTypes = {
    filteredData: PropTypes.arrayOf(PropTypes.object).isRequired,
}


export default MobStudentThesisProposals;