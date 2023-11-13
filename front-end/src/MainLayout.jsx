import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import InsertProposal from './routes/InsertProposal';
import Errors from './routes/Errors'
import Proposals from './routes/Proposals';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import './css/style.css';

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
                            <Route path="/proposals" element={<Proposals />} />
                            <Route path="/insert-proposal" element={<InsertProposal />} />
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

