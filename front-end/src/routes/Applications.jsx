import Errors from "./Errors";
import  TeacherApplications  from "../components/TeacherApplications";
import StudentApplications from "../components/StudentApplications";
import { useAuth } from "../App";

function Applications() {

    const { isLoggedIn, isTeacher } = useAuth();

    return (
        <>
            {isLoggedIn ? (
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
