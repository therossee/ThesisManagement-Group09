import '../css/style.css';
import Errors from "./Errors.jsx";
import { useAuth } from "../components/authentication/useAuth.jsx";
import DisplayVirtualClock from "../components/virtual_clock/DisplayVirtualClock.jsx";

function VirtualClock() {
    const { isTester } = useAuth();

    return isTester ? <DisplayVirtualClock /> : <Errors code="403" />
}

export default VirtualClock
