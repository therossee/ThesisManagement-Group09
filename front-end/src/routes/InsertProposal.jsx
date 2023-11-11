import Errors from "./Errors";
import { InsertThesisProposal } from "../components/Thesis"
import { useAuth } from "../App"

function InsertProposal() {

    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <InsertThesisProposal /> : <Errors code="403" />}
        </>
    )
}

export default InsertProposal