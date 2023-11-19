import Errors from "./Errors";
import { ThesisProposals } from "../components/ThesisProposals";
import { useAuth } from "../App";

function Proposals() {

    const { isLoggedIn, isTeacher } = useAuth();

    return (
        <>
            {isLoggedIn ? (
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
