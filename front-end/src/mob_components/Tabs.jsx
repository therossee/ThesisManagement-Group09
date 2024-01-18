import { useEffect, useState } from 'react';
import { TabBar } from 'antd-mobile';
import { useAuth } from '../components/authentication/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, FileAddOutlined, ToTopOutlined, ClockCircleOutlined, FileDoneOutlined } from '@ant-design/icons';

function Tabs() {
    const { isTester, isTeacher, isStudent } = useAuth();
    const [selectedTab, setSelectedTab] = useState('homeTab');
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if(location.pathname === '/') {
            setSelectedTab('homeTab');
        }
        if (location.pathname === '/login') {
            setSelectedTab('loginTab');
        }
        if (location.pathname === '/proposals') {
            setSelectedTab('proposalsTab');
        }
        if (location.pathname === '/admin/virtual-clock') {
            setSelectedTab('vClockTab');
        }
        if (location.pathname === '/start-request') {
            setSelectedTab('tsrTab');
        }
        if (location.pathname === '/insert-proposal') {
            setSelectedTab('insertTab');
        }
        if (location.pathname === '/applications') {
            setSelectedTab('applicationsTab');
        }
        if (selectedTab === 'logoutTab') {
            navigate('/');
        }
    }, [location])

    const setRouteActive = (value) => {
        navigate(value);
    }

    return (
        <div>
        <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor: "#ffffff"
        }} onChange={value => setRouteActive(value)}
        defaultActiveKey={"/"}
        activeKey={location.pathname}>
            <TabBar.Item
                title="Home"
                key="/"
                icon={<HomeOutlined />}
                selectedIcon={<HomeOutlined />}
                selected={selectedTab === 'homeTab'}
                onPress={() => setSelectedTab('homeTab')}
            >
            </TabBar.Item>
            {(isStudent || isTeacher) && (
            <TabBar.Item 
                title="Proposals"
                key="/proposals" icon={<FileTextOutlined />} 
                selectedIcon={<FileTextOutlined />}
                selected={selectedTab === 'proposalsTab'}
                onPress={() => setSelectedTab('proposalsTab')}>

            </TabBar.Item>)}
            {isTester && (
            <TabBar.Item 
                title="Virtual Clock"
                key="/admin/virtual-clock" icon={<ClockCircleOutlined />} 
                selectedIcon={<ClockCircleOutlined />}
                selected={selectedTab === 'vClockTab'}
                onPress={() => setSelectedTab('vClockTab')}/>

            )}
            {isTeacher &&(
              <TabBar.Item 
              title="Insert Proposal"
              key="/insert-proposal" 
              icon={<FileAddOutlined />}
              selectedIcon={<FileAddOutlined />}
              selected={selectedTab === 'insertTab'}
              onPress={() => setSelectedTab('insertTab')}
            />
            )}
            {(isStudent || isTeacher) && (
            <TabBar.Item 
                title="Applications"
                key="/applications" icon={<ToTopOutlined />}
                selectedIcon={<ToTopOutlined />}
                selected={selectedTab === 'applicationsTab'}
                onPress={() => setSelectedTab('applicationsTab')}/>
            )}
            {(isStudent || isTeacher) && (
                <TabBar.Item
                    title="Thesis Start Request"
                    key="/start-request" icon={<FileDoneOutlined />}
                    selectedIcon={<FileDoneOutlined />}
                    selected={selectedTab === 'tsrTab'}
                    onPress={() => setSelectedTab('tsrTab')}/>
            )}
        </TabBar>
        </div>
    );
}

export { Tabs };