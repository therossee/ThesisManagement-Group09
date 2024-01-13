import { ViewThesisProposal } from "../components/ViewThesisProposal"
import { useAuth } from "../components/authentication/useAuth"
import Errors from "./Errors"

function ViewProposal() {
    
    const { isTeacher, isStudent } = useAuth();

    return (
        (isTeacher || isStudent) ?
        <ViewThesisProposal /> :
        <Errors code="403" />
    )
}

export default ViewProposal
