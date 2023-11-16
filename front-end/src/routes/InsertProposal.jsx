import Errors from "./Errors";
import { InsertThesisProposal } from "../components/Thesis"
import { useAuth } from "../App"

function InsertProposal(props) {
    const user = props.user;
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <InsertThesisProposal user={user}/> : <Errors code="403" />}
        </>
    )
}

export default InsertProposal