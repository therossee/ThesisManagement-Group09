import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Errors from './routes/Errors';
import VirtualClock from "./routes/VirtualClock.jsx";
import InsertProposal from './routes/InsertProposal';
import Proposals from './routes/Proposals';
import ViewProposal from './routes/ViewProposal';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import './css/style.css';
import Applications from './routes/Applications';

const { Content, Footer } = Layout;

function MainLayout(props) {

    return (
        <Router>
            <Layout>
                <SideBar isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher}/>
                <Layout>
                    <TopBar isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher}/>
                    <Content className="content-style">
                        <Routes>
                            <Route path="/" element={<Home isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher} userData={props.userData} />} />
                            <Route path="/admin/virtual-clock" element={<VirtualClock />} />
                            <Route path="/proposals" element={<Proposals isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher} accessToken={props.accessToken}/>} />
                            <Route path="/applications" element={<Applications isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher} accessToken={props.accessToken}/>} />
                            <Route path="/insert-proposal" element={<InsertProposal isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher} accessToken={props.accessToken}/>} />
                            <Route path="/view-proposal/:id" element={<ViewProposal isAuthenticated={props.isAuthenticated} isTeacher={props.isTeacher} accessToken={props.accessToken}/>} />
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

