import Errors from "../routes/Errors";
import { useAuth } from '../components/authentication/useAuth';
import MobTeacherArchive from "../mob_components/MobTeacherArchive.jsx";

function MobArchive() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <MobTeacherArchive /> : <Errors code="403" />}
        </>
    )
}

export default MobArchive