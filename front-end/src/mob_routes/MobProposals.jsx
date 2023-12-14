import Errors from "../routes/Errors";
import MobStudentThesisProposals from "../mob_components/MobStudentThesisProposals";
import MobTeacherThesisProposals from "../mob_components/MobTeacherThesisProposals";
import { useAuth } from '../components/authentication/useAuth';

function Proposals() {

    const { isAuthenticated, isTeacher } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            {(isTeacher === true) && <MobTeacherThesisProposals />}
            {(isAuthenticated === true && isTeacher === false) && <MobStudentThesisProposals />}
            {!isAuthenticated && <Errors code="403" />}
        </>
    )
}

export default Proposals
