import { Table, Typography, Tag } from "antd";
import { Fragment, useEffect } from "react";
import dayjs from 'dayjs';

const { Title } = Typography;

function MobReview(props) {

    //Function to retrieve the data of the form inserted in insert body
    const  formData  = props.formData;
    const { intCoSupervisors, extCoSupervisors, degrees } = props;
    const level = formData.degreeLevel === "L" ? "L - Bachelor Degree" : "LM - Master Degree";
    let intCoSup = [], extCoSup = [];
    if (formData.intCoSupervisors !== undefined) {
      intCoSup = intCoSupervisors.filter((x) => formData.intCoSupervisors.includes(x.id));
    }
    if (formData.extCoSupervisors !== undefined) {
      extCoSup = extCoSupervisors.filter((x) => formData.extCoSupervisors.includes(x.id));
    }
    const expiration = dayjs(formData.expirationDate);

    const selCds = degrees.filter((x) => formData.cds.includes(x.cod_degree));
    const data = [
      { field: "Title", value: formData.title },
      {
        field: "Int. co-Sup",
        value: intCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
      },
      {
        field: "Ext. co-Sup",
        value: extCoSup.map((x) => `${x.name} ${x.surname}`).join(", "),
      },
      {
        field: "Keywords",
        value: formData.keywords.map((keyword) => <Tag key={keyword}>{keyword}</Tag>),
      },
      { field: "Type", value: formData.type },
      { field: "Description", value: formData.description },
      { field: "Req. Knowledge", value: formData.requiredKnowledge },
      { field: "Notes", value: formData.notes },
      {
        field: "Exp. Date",
        value: expiration
          ? expiration.format("YYYY-MM-DD")
          : "",
      },
      { field: "Level", value: level },
      { field: "CdS", 
      value: selCds.map((x, i) => 
      <Fragment key={i}>
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
        <Title level={2}>Review Proposal</Title>
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

  export { MobReview };