import Errors from "./Errors";
import { InsertThesisProposal } from "../components/InsertThesisProposal"
import { useAuth0 } from "@auth0/auth0-react";

function InsertProposal() {
    const { isTeacher } = useAuth0();

    return (
        <>
            {isTeacher ? <InsertThesisProposal /> : <Errors code="403" />}
        </>
    )
}

export default InsertProposal