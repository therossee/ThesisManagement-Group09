import { useEffect, useState } from 'react';
import { TabBar } from 'antd-mobile';
import { useAuth } from '../components/authentication/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, FileAddOutlined, ToTopOutlined, InboxOutlined } from '@ant-design/icons';

function Tabs() {
    const { isTeacher, isStudent } = useAuth();
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
            {isTeacher &&(
                <TabBar.Item
                    title="Archive"
                    key="/archive"
                    icon={<InboxOutlined />}
                    selectedIcon={<InboxOutlined />}
                    selected={selectedTab === 'archive'}
                    onPress={() => setSelectedTab('archive')}
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
        </TabBar>
        </div>
    );
}

export { Tabs };