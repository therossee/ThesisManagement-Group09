import Errors from "./Errors";
import StudentThesisProposals from "../components/StudentThesisProposals";
import TeacherThesisProposals from "../components/TeacherThesisProposals";
import { useAuth } from '../components/authentication/useAuth';

function Proposals() {

    const { isAuthenticated, isTeacher } = useAuth();

    return (
        <>
            {isAuthenticated ? (
                isTeacher ? (
                    <TeacherThesisProposals />
                ) : (
                    <StudentThesisProposals />
                )
            ) : (
                <Errors code="403" />
            )}
        </>
    )
}

export default Proposals
