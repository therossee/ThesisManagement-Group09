import Errors from "../routes/Errors";
import MobStudentThesisProposals from "../mob_components/MobStudentThesisProposals";
import MobTeacherThesisProposals from "../mob_components/MobTeacherThesisProposals";
import { useAuth } from '../components/authentication/useAuth';

function Proposals() {

    const { isAuthenticated, isTeacher, isStudent, isSecretaryClerk } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            {isTeacher === true && <MobTeacherThesisProposals />}
            {isStudent === true && <MobStudentThesisProposals />}
            {(!isAuthenticated || isSecretaryClerk === true) && <Errors code="403" />}
        </>
    )
}

export default Proposals
