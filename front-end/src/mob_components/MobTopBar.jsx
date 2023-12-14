import { NavBar } from 'antd-mobile';
import { useAuth } from '../components/authentication/useAuth';
import MobLogin from './MobLogin';
import MobLogout from './MobLogout';
import '../css/style.css';

function MobTopBar() {
    const { isAuthenticated } = useAuth();

    return (
        <NavBar
            backArrow={false}
            style={{ height: "60px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h4 style={{ margin: "0 0 0 10px" }}>Thesis Management</h4>
                </div>
                {isAuthenticated ?
                    <IsLoggedInForm />
                    :
                    <MobLogin />
                }
            </div>
        </NavBar>
    )
}

function IsLoggedInForm() {

    return (
        <div>
            <MobLogout />
        </div>
    )
}

export default MobTopBar;