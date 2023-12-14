import { Popup, AutoCenter } from 'antd-mobile';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from '../API';

function MobModal(props) {

    const { setIsOpen, setLoading, setDisabled, isOpen, loading } = props;

    const { id } = useParams();

    // Handling file uplaoded
    const [uploadedFile, setUploadedFile] = useState(null);

    const fileAdd = file => {
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

    const uploadHandler = ({ file, onSuccess, onError }) => {
        try {
            setUploadedFile(file);
            onSuccess();
        }
        catch {
            onError();
        }
    }

    const statusAdd = info => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} loaded`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} failed to load`);
        }
    }

    const apply = () => {
        setLoading(true);
        sendApplication();
        setIsOpen(false);
    }

    async function sendApplication() {
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
        <Popup title="Application"
               visible={isOpen}
               confirmText="Send"
               okButtonProps={{ loading: loading }}
               cancelText="Cancel"
        >
            <Alert message="PDF upload is optional" type="info" showIcon closable style={{ marginBottom: "7px", marginRight: "3%", marginLeft:"3%", marginTop:"3%"}} />
            <AutoCenter>
                <h3>Are you sure you want to apply?</h3>
            </AutoCenter>
            <AutoCenter>
                <Upload
                    beforeUpload={fileAdd}
                    onChange={statusAdd}
                    customRequest={uploadHandler}
                    file={uploadedFile}
                    maxCount={1}
                    multiple={false}
                    onRemove={() => setUploadedFile(null)}
                >

                    <p>Max one PDF allowed (10MB)</p>
                    <AutoCenter>
                        <Button><UploadOutlined />Upload PDF</Button>
                    </AutoCenter>
                </Upload>
            </AutoCenter>
            <AutoCenter>
                <div style={{marginTop: "7%", marginBottom:"10%"}}>
                    <Button type="primary" onClick={apply}>Ok</Button>
                    <Button onClick={() => { setUploadedFile(null); setIsOpen(false) }}>Cancel</Button>
                </div>
            </AutoCenter>
        </Popup>
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