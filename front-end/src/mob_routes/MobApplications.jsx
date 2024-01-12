import Errors from "../routes/Errors";
import MobTeacherApplications from "../mob_components/MobTeacherApplications";
import StudentApplications from "../components/StudentApplications";
import { useAuth } from '../components/authentication/useAuth';

function MobApplications() {
    const { isAuthenticated, isTeacher, isStudent, isSecretaryClerk } = useAuth();

    return (
        <>
            {isTeacher === true && <MobTeacherApplications />}
            {isStudent === true && <StudentApplications />}
            {(!isAuthenticated || isSecretaryClerk === true) && <Errors code="403" />}
        </>
    );
}

export default MobApplications
