import Errors from "./Errors";
import { ThesisProposals } from "../components/ThesisProposals";
import { useAuth0 } from "@auth0/auth0-react";

function Proposals() {

    const { isAuthenticated, isTeacher } = useAuth0();

    return (
        <>
            {isAuthenticated ? (
                isTeacher ? (
                    "Show there maybe another story like show and edit active proposals by the teacher"
                ) : (
                    <ThesisProposals />
                )
            ) : (
                <Errors code="403" />
            )}
        </>
    )
}

export default Proposals
