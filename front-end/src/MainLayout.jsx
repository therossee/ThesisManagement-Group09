import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import NotFound from './routes/NotFound'
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import './css/style.css';

const { Content, Footer } = Layout;

function MainLayout() {

    return (
        <Router>
            <Layout>
                <SideBar />
                <Layout >
                    <TopBar />
                    <Content className="content-style">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/*" element={<NotFound />} />
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

