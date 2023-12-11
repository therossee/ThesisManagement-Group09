import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Button, Result } from "antd";

function Errors(props) {

    return (
        <div>
            {content(props.code)}
        </div>
    )
}

Errors.propTypes = {
    code: PropTypes.string.isRequired,
};

function content(code) {

    const navigate = useNavigate();

    switch (code) {
        case "403":
            return (
                <Result
                    status="403"
                    title="You are not authorized to access this page."
                    subTitle="Please log in using the necessary user-level credentials or return to the home page."
                    extra={<Button ghost type="primary" onClick={() => navigate("/")}>Back Home</Button>}
                />
            )
        case "404":
            return (
                <Result
                    status="404"
                    title="Sorry, the page you are looking for does not exist."
                    subTitle="Please, double check the address."
                    extra={<Button ghost type="primary" onClick={() => navigate("/")}>Back Home</Button>}
                />
            )
        default:
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong."
                    extra={<Button ghost type="primary" onClick={() => navigate("/")}>Back Home</Button>}
                />
            )
    }
}

export default Errors
