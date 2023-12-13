import Errors from "../components/Errors";
import { MobEditThesisProposal } from "../components/EditThesisProposal"
import { useAuth } from '../components/authentication/useAuth';

function MobEditProposal() {
    const { isTeacher } = useAuth();

    return (
        <>
            {isTeacher ? <MobEditThesisProposal /> : <Errors code="403" />}
        </>
    )
}

export default MobEditProposal