import Errors from "./Errors";
import SecretaryStartRequest from "../components/SecretaryStartRequest";
import { useAuth } from '../components/authentication/useAuth';

function Applications() {
    const { isAuthenticated, isSecretaryClerk } = useAuth();

    return (
        <>
            {(isSecretaryClerk === true) && <SecretaryStartRequest />}
            {!isAuthenticated && <Errors code="403" />}
        </>
    );
}

export default Applications
