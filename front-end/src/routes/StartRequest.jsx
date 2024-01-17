import Errors from "./Errors";
import StudentThesisStartRequest from "../components/StudentThesisStartRequest";
import TeacherThesisStartRequest from "../components/TeacherThesisStartRequest";
import { useAuth } from '../components/authentication/useAuth';

function StartRequest() {

    const { isAuthenticated, isStudent, isTeacher } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            {isTeacher === true && <TeacherThesisStartRequest />}
            {isStudent === true && <StudentThesisStartRequest />}
            {!isAuthenticated && <Errors code="403" />}
        </>
    )
}

export default StartRequest;
