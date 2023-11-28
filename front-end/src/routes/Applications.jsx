import Errors from "./Errors";
import { ThesisApplications } from "../components/Applications"

function Applications(props) {

    return (
        <>
            {props.isAuthenticated ? (
                props.isTeacher ? (
                    <ThesisApplications accessToken={props.accessToken}/>
                ) : (
                    <Errors code="403" />
                )
            ) : (
                <Errors code="403" />
            )}
        </>
    )
}

export default Applications
