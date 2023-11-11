import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

function NotFound() {

    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="Sorry, the page you are looking for does not exist."
            subTitle="Please, double check the address."
            extra={<Button type="primary" onClick={() => navigate("/")}>Back Home</Button>}
        />
    )
}

export default NotFound
