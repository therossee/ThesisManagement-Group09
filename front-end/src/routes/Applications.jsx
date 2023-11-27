import Errors from "./Errors";
import { ThesisApplications } from "../components/Applications"
import { useAuth0 } from "@auth0/auth0-react";

function Applications() {

    const { isAuthenticated, isTeacher } = useAuth0();

    return (
        <>
            {isAuthenticated ? (
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
