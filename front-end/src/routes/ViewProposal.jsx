import { ViewThesisProposal } from "../components/ViewThesisProposal"

function ViewProposal(props) {

    return (
        <ViewThesisProposal isTeacher={props.isTeacher} isAuthenticated={props.isAuthenticated} accessToken={props.accessToken} />
    )
}

export default ViewProposal
