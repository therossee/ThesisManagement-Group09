import Errors from "../routes/Errors";
import MobInsertProposal  from "../mob_components/MobInsertThesisProposal"
import { useAuth } from "../components/authentication/useAuth";

function MobThesisProposal() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <MobInsertProposal /> : <Errors code="403" />}
        </>
    )
}

export default MobThesisProposal