import Errors from "./Errors";
import SecretaryStartRequest from "../components/SecretaryStartRequest";
import { useAuth } from '../components/authentication/useAuth';

function Applications() {
    const { isAuthenticated, isTeacher } = useAuth();

    return (
        <>
            {(isTeacher === true) && <SecretaryStartRequest />}
            {!isAuthenticated && <Errors code="403" />}
        </>
    );
}

export default Applications
