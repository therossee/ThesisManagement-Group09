import Errors from "./Errors";
import { InsertThesisProposal } from "../components/InsertThesisProposal"
import { useAuth } from '../components/authentication/useAuth';

function InsertProposal() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <InsertThesisProposal /> : <Errors code="403" />}
        </>
    )
}

export default InsertProposal