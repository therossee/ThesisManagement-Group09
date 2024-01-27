import { useState } from 'react';
import { Layout, FloatButton } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { SettingFilled } from '@ant-design/icons';
import { useAuth } from './components/authentication/useAuth';
import Applications from './routes/Applications'
import Home from './routes/Home';
import Errors from './routes/Errors';
import VirtualClock from "./routes/VirtualClock";
import InsertProposal from './routes/InsertProposal';
import EditProposal from './routes/EditProposal';
import Proposals from './routes/Proposals';
import StartRequest from './routes/StartRequest';
import ViewProposal from './routes/ViewProposal';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Archive from './routes/Archive.jsx';
import './css/style.css';

function MainLayout() {

    const { Content } = Layout;
    const { isTester } = useAuth();

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Router>
            <Layout>
                <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Layout>
                    <TopBar collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Content className="content-style">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/admin/virtual-clock" element={<VirtualClock />} />
                            <Route path="/proposals" element={<Proposals />} />
                            <Route path="/archive" element={<Archive />} />
                            <Route path="/applications" element={<Applications />} />
                            <Route path="/insert-proposal/:id?" element={<InsertProposal />} />
                            <Route path="/view-proposal/:id" element={<ViewProposal />} />
                            <Route path="/edit-proposal/:id" element={<EditProposal />} />
                            <Route path="/start-request" element={<StartRequest />} />
                            <Route path="/*" element={<Errors code="404" />} />
                        </Routes>
                        {isTester && <SettingsButton />}
                    </Content>
                    <div className="footer-wrapper">
                        <div className="footer-style">
                            ✨ Made with 💙 by Group 9 ✨
                        </div>
                    </div>
                </Layout>
            </Layout>
        </Router>
    )
}

function SettingsButton() {
    const navigate = useNavigate();
    return (
        <FloatButton shape="circle" type="primary" tooltip="Tester Settings" style={{ left: 50 }} icon={<SettingFilled />} onClick={() => navigate("/admin/virtual-clock")} />
    )
}

export default MainLayout;
