import { Table, Typography, Tag } from "antd";
import PropTypes from 'prop-types';
import { Fragment } from "react";
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

function ReviewProposal(props) {
    
  const { formData, intCoSupervisors, extCoSupervisors, degrees } = props;

  const level = formData.degreeLevel === "L" ? "L - Bachelor Degree" : "LM - Master Degree";
  let intCoSup = [], extCoSup = [];
  if (formData.intCoSupervisors !== undefined) {
    intCoSup = intCoSupervisors.filter((x) => formData.intCoSupervisors.includes(x.id));
  }
  if (formData.extCoSupervisors !== undefined) {
    extCoSup = extCoSupervisors.filter((x) => formData.extCoSupervisors.includes(x.id));
  }
  const selCds = degrees.filter((x) => formData.cds.includes(x.cod_degree));
  const data = [
    { field: "Title", value: formData.title },
    {
      field: "Internal co-Supervisors",
      value: intCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
    },
    {
      field: "External co-Supervisors",
      value: extCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
    },
    {
      field: "Keywords",
      value: formData.keywords.map((keyword) => <Tag key={uuidv4}>{keyword}</Tag>),
    },
    { field: "Type", value: formData.type },
    { field: "Description", value: formData.description },
    { field: "Required Knowledge", value: formData.requiredKnowledge },
    { field: "Notes", value: formData.notes },
    {
      field: "Expiration Date",
      value: formData.expirationDate
        ? formData.expirationDate.format("YYYY-MM-DD")
        : "",
    },
    { field: "Level", value: level },
    { field: "CdS", 
    value: selCds.map((x, i) => 
    <Fragment key={uuidv4()}>
      {`${x.cod_degree} - ${x.title_degree}`}
      {i < selCds.length - 1 && <br />}
    </Fragment>
  ), },
  ];

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: "35%",
      render: (value) => (value === "Field" ? null : <Typography.Text strong>{value}</Typography.Text>),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => (Array.isArray(value) ? value : <span>{value}</span>),
    },
  ];

  return (
    <>
      <Title level={2} style={{ paddingLeft: "32%" }}>Review Proposal</Title>
      <Table
        dataSource={data}
        columns={columns}
        size="middle"
        showHeader={false}
        pagination={false}
      />
    </>
  );
}

  // Prop type validation
ReviewProposal.propTypes = {
  formData: PropTypes.shape({
    degreeLevel: PropTypes.string.isRequired,
    intCoSupervisors: PropTypes.array,
    extCoSupervisors: PropTypes.array,
    cds: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    keywords: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    requiredKnowledge: PropTypes.string,
    notes: PropTypes.string,
    expirationDate: PropTypes.object.isRequired,
}),
  intCoSupervisors: PropTypes.array,
  extCoSupervisors: PropTypes.array,
  degrees: PropTypes.array,
};

  export { ReviewProposal };