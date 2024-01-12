const THESIS_START_REQUEST_STATUS = Object.freeze({
    WAITING_FOR_APPROVAL: 'waiting for approval',
    ACCEPTED_BY_TEACHER: 'accepted by teacher',
    REJECTED_BY_TEACHER: 'rejected by teacher',
    ACCEPTED_BY_SECRETARY: 'accepted by secretary',
    REJECTED_BY_SECRETARY: 'rejected by secretary',
    CHANGES_REQUESTED: 'changes requested',
});

module.exports = {
    THESIS_START_REQUEST_STATUS
};
