import Errors from "./Errors";
import  TeacherArchive  from "../components/TeacherArchive"
import { useAuth } from '../components/authentication/useAuth';

function Archive() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <TeacherArchive /> : <Errors code="403" />}
        </>
    )
}

export default Archive