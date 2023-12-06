import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function UploadResult(props) {
    const navigate = useNavigate();
    const id = props.proposalId;
    const error = props.error;
    const update = props.update;
    if (id !== -1) {
      return (
        <>
        {update ? (
        
        <Result
          status="success"
          title="Proposal updated succesfully!"
          subTitle={`ID of the proposal: ${id}`}
          extra={
            <Button ghost type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
        />) : (<Result
          status="success"
          title="Proposal added succesfully!"
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

  export { UploadResult };