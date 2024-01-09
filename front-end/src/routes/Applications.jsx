import Errors from "./Errors";
import TeacherApplications from "../components/TeacherApplications";
import StudentApplications from "../components/StudentApplications";
import { useAuth } from '../components/authentication/useAuth';

function Applications() {
    const { isAuthenticated, isTeacher, isStudent, isSecretaryClerk } = useAuth();

    return (
        <>
            {(isAuthenticated === true && isTeacher === true) && <TeacherApplications />}
            {(isAuthenticated === true && isStudent === true) && <StudentApplications />}
            {(!isAuthenticated || isSecretaryClerk === true) && <Errors code="403" />}
        </>
    );
}

export default Applications
