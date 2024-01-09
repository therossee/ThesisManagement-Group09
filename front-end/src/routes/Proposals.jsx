import Errors from "./Errors";
import StudentThesisProposals from "../components/StudentThesisProposals";
import TeacherThesisProposals from "../components/TeacherThesisProposals";
import { useAuth } from '../components/authentication/useAuth';

function Proposals() {

    const { isAuthenticated, isTeacher, isStudent, isSecretaryClerk } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            {(isAuthenticated === true && isTeacher === true) && <TeacherThesisProposals />}
            {(isAuthenticated === true && isStudent === true) && <StudentThesisProposals />}
            {(!isAuthenticated || isSecretaryClerk === true) && <Errors code="403" />}
        </>
    )
}

export default Proposals
