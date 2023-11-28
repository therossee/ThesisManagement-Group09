import Errors from "./Errors";
import { InsertThesisProposal } from "../components/InsertThesisProposal"

function InsertProposal(props) {
    
    return (
        <>
            {props.isTeacher ? <InsertThesisProposal accessToken={props.accessToken}/> : <Errors code="403" />}
        </>
    )
}

export default InsertProposal