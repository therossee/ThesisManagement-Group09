import Errors from "./Errors";
import TeacherApplications from "../components/TeacherApplications";
import StudentApplications from "../components/StudentApplications";
import { useAuth } from '../components/authentication/useAuth';

function Applications() {

    const { isAuthenticated, isTeacher } = useAuth();

    return (
        <>
            {isAuthenticated ? (
                isTeacher ? (
                    <TeacherApplications />
                ) : (
                    <StudentApplications />
                )
            ) : (
                <Errors code="403" />
            )}
        </>
    )
}

export default Applications
