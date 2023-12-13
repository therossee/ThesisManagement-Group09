import Errors from "./Errors";
import MobTeacherApplications from "../mob_components/MobTeacherApplications";
import StudentApplications from "../components/StudentApplications";
import { useAuth } from '../components/authentication/useAuth';

function MobApplications() {
    const { isAuthenticated, isTeacher } = useAuth();

    return (
        <>
            {(isTeacher === true) && <MobTeacherApplications />}
            {(isAuthenticated === true && isTeacher === false) && <StudentApplications />}
            {!isAuthenticated && <Errors code="403" />}
        </>
    );
}

export default MobApplications
