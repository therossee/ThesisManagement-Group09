import Errors from "./Errors";
import { useAuth0 } from "@auth0/auth0-react";
import StudentThesisProposals from "../components/StudentThesisProposals";
import TeacherThesisProposals from "../components/TeacherThesisProposals";
import { useAuth } from "../App";

function Proposals() {

    const { isAuthenticated, isTeacher } = useAuth0();

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
