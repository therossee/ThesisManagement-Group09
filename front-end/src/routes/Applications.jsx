import Errors from "./Errors";
import { ThesisApplications } from "../components/Applications"
import { useAuth } from "../App";

function Applications() {

    const { isLoggedIn, isTeacher } = useAuth();

    return (
        <>
            {isLoggedIn ? (
                isTeacher ? (
                    <ThesisApplications />
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
