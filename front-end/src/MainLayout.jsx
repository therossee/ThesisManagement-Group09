import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Errors from './routes/Errors';
import VirtualClock from "./routes/VirtualClock.jsx";
import InsertProposal from './routes/InsertProposal';
import EditProposal from './routes/EditProposal.jsx';
import Proposals from './routes/Proposals';
import ViewProposal from './routes/ViewProposal';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import './css/style.css';
import Applications from './routes/Applications';

const { Content, Footer } = Layout;

function MainLayout() {

    return (
        <Router>
            <Layout>
                <SideBar />
                <Layout>
                    <TopBar />
                    <Content className="content-style">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/admin/virtual-clock" element={<VirtualClock />} />
                            <Route path="/proposals" element={<Proposals />} />
                            <Route path="/applications" element={<Applications />} />
                            <Route path="/insert-proposal" element={<InsertProposal/>} />
                            <Route path="/view-proposal/:id" element={<ViewProposal />} />
                            <Route path="/edit-proposal/:id" element={<EditProposal />} />
                            <Route path="/*" element={<Errors code="404"/>} />
                        </Routes>
                    </Content>
                    <Footer className="footer-style">
                        SE2 - Group 9
                    </Footer>
                </Layout>
            </Layout>
        </Router>
    )
}

export default MainLayout;

