import Errors from "./Errors";
import StudentThesisProposals from "../components/StudentThesisProposals";
import TeacherThesisProposals from "../components/TeacherThesisProposals";
import { useAuth } from "../App";

function Proposals() {

    const { isLoggedIn, isTeacher } = useAuth();

    return (
        <>
            {isLoggedIn ? (
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
