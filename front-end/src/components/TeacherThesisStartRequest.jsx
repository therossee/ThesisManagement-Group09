import { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import API from '../API';

function TeacherThesisStartRequest() {
    return (
        <Button onClick={() => API.getTeacherActiveThesisStartRequest()} >test</Button>
    )
}

export default TeacherThesisStartRequest;