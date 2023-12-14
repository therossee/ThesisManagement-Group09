import Errors from "../routes/Errors";
import { MobEditThesisProposal } from "../mob_components/MobEditThesisProposal"
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