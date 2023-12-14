import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function MobResult(props) {
    const navigate = useNavigate();
    const id = props.proposalId;
    const error = props.error;
    const update = props.update;
    if (id !== -1) {
      return (
        <>
        { update ? (
          <Result
          status="success"
          title="Proposal updated successfully!"
          extra={
            <Button ghost type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
        />) :(
        <Result
          status="success"
          title="Proposal added succesfully!"
          subTitle={`ID of the proposal: ${id}`}
          extra={
            <Button ghost type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
        />)}
        </>
      );
    } else {
      return (
        <Result
          status={`${error}`}
          title={`${error}`}
          subTitle="Sorry, something went wrong."
          extra={
            <Button ghost type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
        />
      );
    }
  }

  MobResult.propTypes = {
    proposalId: PropTypes.number,
    error: PropTypes.number,
    update: PropTypes.bool,
  }

  export { MobResult };