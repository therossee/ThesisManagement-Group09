import Errors from "../routes/Errors";
import { MobStudentThesisStartRequest } from "../mob_components/MobStudentThesisStartRequest";
import MobTeacherThesisStartRequest from "../mob_components/MobTeacherThesisStartRequest";
import { useAuth } from '../components/authentication/useAuth';
import MobSecretaryStartRequest from "../mob_components/MobSecretaryStartRequest.jsx";

function MobStartRequest() {

    const { isAuthenticated, isSecretaryClerk, isStudent, isTeacher } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            {isTeacher === true && <MobTeacherThesisStartRequest />}
            {isStudent === true && <MobStudentThesisStartRequest />}
            {isSecretaryClerk === true && <MobSecretaryStartRequest/>}
            {isAuthenticated !== true && <Errors code="403" />}
        </>
    )
}

export default MobStartRequest;