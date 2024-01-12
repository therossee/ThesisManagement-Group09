import { useEffect, useState } from 'react';
import { TabBar } from 'antd-mobile';
import { useAuth } from '../components/authentication/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, FileAddOutlined, ToTopOutlined, ClockCircleOutlined } from '@ant-design/icons';

function Tabs() {
    const { isAuthenticated, isTester, isTeacher, isStudent } = useAuth();
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
            {isAuthenticated && (isStudent || isTeacher) && (
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
            {isAuthenticated && (isStudent || isTeacher) && (
            <TabBar.Item 
                title="Applications"
                key="/applications" icon={<ToTopOutlined />}
                selectedIcon={<ToTopOutlined />}
                selected={selectedTab === 'applicationsTab'}
                onPress={() => setSelectedTab('applicationsTab')}/>
            )}  
        </TabBar>
        </div>
    );
}

export { Tabs };