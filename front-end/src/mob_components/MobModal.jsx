import { Popup, AutoCenter, Button } from 'antd-mobile';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from '../API';

function MobModal(props) {

    const { setIsOpen, setLoading, setDisabled, isOpen, loading } = props;

    const { id } = useParams();

    // Handling file uplaoded
    const [uploadedFile, setUploadedFile] = useState(null);

    const beforeUpload = file => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('You can only upload PDF files!');
            return Upload.LIST_IGNORE; // Prevent file load
        }
        const isSizeValid = file.size / 1024 / 1024 < 10; // 10MB limit
        if (!isSizeValid) {
            message.error('File size exceeds the limit (10MB).');
            return Upload.LIST_IGNORE; // Prevent file load
        }
        return true; // Continue
    };

    const handleUpload = ({ file, onSuccess, onError }) => {
        try {
            setUploadedFile(file);
            onSuccess();
        }
        catch {
            onError();
        }
    }

    const onChange = info => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} loaded`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} failed to load`);
        }
    }

    const applyForProposal = () => {
        setLoading(true);
        addApplication();
        setIsOpen(false);
    }

    async function addApplication() {
        try {
            await API.applyForProposal(id, uploadedFile);
            message.success("Successfully applied");
            setUploadedFile(null);
            setDisabled(true);
            setLoading(false);
        } catch (err) {
            message.error(err.message ? err.message : err);
            setUploadedFile(null);
            setDisabled(false);
            setLoading(false);
        }
    }

    return (
        <div style={{paddingBottom:"60px"}}>
        <Popup title="Application"
            visible={isOpen}
            confirmText="Send"
            okButtonProps={{ loading: loading }}
            cancelText="Cancel"
        >
            <Alert message="PDF upload is optional" type="info" showIcon closable style={{ marginBottom: "7px" }} />
            <AutoCenter>
            <Upload
                beforeUpload={beforeUpload}
                onChange={onChange}
                customRequest={handleUpload}
                file={uploadedFile}
                maxCount={1}
                multiple={false}
                onRemove={() => setUploadedFile(null)}
            >
            <div style={{ marginLeft: "5%", marginRight:"5%", marginTop:"10%" }}>
                    <Button><UploadOutlined />Upload PDF</Button>
                <p className="ant-upload-hint">Max one PDF allowed (10MB)</p>

            </div>
            </Upload>
            <Button onClick={applyForProposal}>Ok</Button>
            <Button onClick={() => { setUploadedFile(null); setIsOpen(false) }}>Cancel</Button>
            </AutoCenter>
        </Popup>
        </div>
    );

}

MobModal.propTypes = {
    setIsOpen: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setDisabled: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
}

export default MobModal;