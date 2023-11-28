import Errors from "./Errors";
import StudentThesisProposals from "../components/StudentThesisProposals";
import TeacherThesisProposals from "../components/TeacherThesisProposals";

function Proposals(props) {

    return (
        <>
            {props.isAuthenticated ? (
                props.isTeacher ? (
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
