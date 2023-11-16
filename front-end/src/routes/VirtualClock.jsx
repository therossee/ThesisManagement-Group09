import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, DatePicker, Flex, message, Space, Typography } from 'antd';
import { EditOutlined, RollbackOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import '../css/style.css';
import API from "../API.jsx";

const { Title, Text } = Typography;

function VirtualClock() {
    const [messageApi, contextHolder] = message.useMessage();

    // Clock from server
    const [offset, setOffset] = useState(0);
    const [date, setDate] = useState(dayjs.tz());
    // State of the page
    const [editMode, setEditMode] = useState(false);
    const [dateSelected, setDateSelection] = useState(undefined);


    /*
     * Methods used in HTML rendering
     */

    const formatOffset = () => {
        const duration = dayjs.duration(Math.abs(offset), 'milliseconds');

        const nbDays = duration.get('day');
        const nbHours = duration.get('hour');
        const nbMinutes = duration.get('minute');
        const nbSeconds = duration.get('second');
        const nbMilliseconds = duration.get('millisecond');

        const dynamicFormats = [!!nbDays && "D [days]", !!nbHours && "H [hours]", !!nbMinutes && "m [minutes]", !!nbSeconds && "s [seconds]", !!nbMilliseconds && "SSS [milliseconds]"]
            .filter(Boolean)
            .join(' ');

        return duration.format(dynamicFormats)
    };
    const renderOffsetMessage = () => {
        if (dayjs.tz().isBefore(date)) {
            return <Text type="secondary">The clock is <strong>{formatOffset()}</strong> ahead the real time</Text>;
        } else if (dayjs.tz().isAfter(date)) {
            return <Text type="secondary">The clock is <strong>{formatOffset()}</strong> behind the real time</Text>;
        } else {
            return ''
        }
    };

    /*
     * Methods used in HTML events to call APIs
     */
    const updateClock = () => {
        API.updateClock(dateSelected?.toISOString())
            .then( clock => {
                setOffset(clock.offset);
                setDate(dayjs.tz().add(clock.offset, 'milliseconds'));
                setEditMode(false);
            })
            .catch( error => {
                messageApi.error('An error occurred while updating the clock: ' + error.message);
            });
    };
    const resetOffset = () => {
        setDateSelection(undefined);
        updateClock();
    };

    /*
     * Effect hooks
     */
    /**
     * Get the clock from the server to set the offset and the date
     */
    useEffect(() => {
        API.getClock()
            .then( clock => {
                setOffset(clock.offset);
                setDate(dayjs.tz().add(clock.offset, 'milliseconds'));
            })
            .catch( error => {
                console.log(error);
                messageApi.error('An error occurred while getting the clock: ' + error.message);
            });
    }, [messageApi]);
    /**
     * Register a timer to update the date displayed every second
     */
    useEffect(() => {
        const timer = setInterval( ()=> setDate(dayjs.tz().add(offset, 'milliseconds')), 1000 );

        return function cleanup() {
            clearInterval(timer)
        }
    }, [offset]);


    return (
        <Flex vertical style={{ height: '100%' }}>
            <Title className="home-title">Virtual Clock Management</Title>

            {!editMode &&
                <Flex vertical style={{ height: '100%' }} justify="center" gap="large">
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <Title level={2}>{date.format("MMM D, YYYY - HH:mm:ss")}</Title>

                        {offset !== 0 && renderOffsetMessage()}
                    </Space>

                    <Flex direction="row" justify="center" align="center" wrap="wrap" style={{ width: '100%', marginTop: '20px' }} gap="large">
                        <Button type="primary" shape="round" icon={<EditOutlined />} size="large" onClick={() => setEditMode(true)}>
                            EDIT
                        </Button>

                        {offset !== 0 &&
                            <Button type="primary" danger shape="round" icon={<UndoOutlined />} size="large" onClick={resetOffset}>
                                RESET OFFSET
                            </Button>
                        }
                    </Flex>
                </Flex>
            }
            {editMode &&
                <Flex vertical style={{ height: '100%' }} justify="center" gap="large">
                    <DatePicker
                        format="DD/MM/YYYY hh:mm Z"
                        size="large"
                        showTime={true}
                        showNow={false}
                        allowClear={false}
                        defaultValue={date}
                        onChange={ (date) => setDateSelection(date) }
                    />

                    <Flex direction="row" justify="center" align="center" wrap="wrap" style={{ width: '100%', marginTop: '20px' }} gap="large">
                        <Button danger shape="round" icon={<RollbackOutlined />} size="large" onClick={() => setEditMode(false)}>
                            CANCEL
                        </Button>

                        {offset !== 0 &&
                            <Button type="primary" danger shape="round" icon={<UndoOutlined />} size="large" onClick={resetOffset}>
                                RESET OFFSET
                            </Button>
                        }

                        <Button type="primary" shape="round" icon={<SaveOutlined />} size="large" onClick={() => updateClock()}>
                            SAVE NEW CLOCK
                        </Button>
                    </Flex>
                </Flex>
            }

            {contextHolder}
        </Flex>
    )
}

export default VirtualClock
