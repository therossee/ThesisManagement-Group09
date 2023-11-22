import { Table, Typography, Tag } from "antd";

const { Title } = Typography;

function ReviewProposal(props) {
    //Function to retrieve the data of the form inserted in insert body
    const formData = props.formData;
    const { intCoSupervisors, extCoSupervisors, degrees } = props;
    const deg = degrees.find((x) => x.cod_degree === formData.cds);
    const level = formData.degreeLevel === "L" ? "L - Bachelor Degree" : "LM - Master Degree";
    let intCoSup = [], extCoSup = [];
    if (formData.intCoSupervisors !== undefined) {
      intCoSup = intCoSupervisors.filter((x) => formData.intCoSupervisors.includes(x.id));
    }
    if (formData.extCoSupervisors !== undefined) {
      extCoSup = extCoSupervisors.filter((x) => formData.extCoSupervisors.includes(x.id));
    }
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
        value: formData.keywords.map((keyword) => <Tag key={keyword}>{keyword}</Tag>),
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
      { field: "CdS", value: `${formData.cds} - ${deg.title_degree}` },
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

  export { ReviewProposal };