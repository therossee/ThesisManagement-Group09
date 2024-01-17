import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MobHome from './mob_routes/MobHome';
import Errors from './routes/Errors';
import VirtualClock from "./routes/VirtualClock.jsx";
import MobThesisProposal from './mob_routes/MobThesisProposal';
import MobEditProposal from './mob_routes/MobEditProposal.jsx';
import MobProposals from './mob_routes/MobProposals';
import ViewProposal from './routes/ViewProposal';
import MobTopBar from './mob_components/MobTopBar';
import './css/style.css';
import MobApplications from './mob_routes/MobApplications';
import { Tabs } from './mob_components/Tabs'
import MobArchive from "./mob_components/MobArchive.jsx";

const { Content, Footer } = Layout;

function MobLayout() {

    return (
        <Router>
                <Layout>
                    <MobTopBar />
                    <Content className="content-style">
                        <Routes>
                            <Route path="/" element={<MobHome />} />
                            <Route path="/admin/virtual-clock" element={<VirtualClock />} />
                            <Route path="/proposals" element={<MobProposals />} />
                            <Route path="/applications" element={<MobApplications />} />
                            <Route path="/insert-proposal/:id?" element={<MobThesisProposal/>} />
                            <Route path="/view-proposal/:id" element={<ViewProposal />} />
                            <Route path="/edit-proposal/:id" element={<MobEditProposal />} />
                            <Route path="/archive" element={<MobArchive />} />
                            <Route path="/*" element={<Errors code="404"/>} />
                        </Routes>
                    </Content>
                    <Tabs />
            </Layout>
        </Router>
    )
}

export default MobLayout;
