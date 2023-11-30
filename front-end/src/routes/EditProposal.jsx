import Errors from "./Errors";
import { EditThesisProposal } from "../components/EditThesisProposal"
import { useAuth } from '../components/authentication/useAuth';

function EditProposal() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <EditThesisProposal /> : <Errors code="403" />}
        </>
    )
}

export default EditProposal