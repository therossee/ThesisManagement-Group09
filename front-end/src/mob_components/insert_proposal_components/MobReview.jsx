import { Table, Typography, Tag } from "antd";
import { Fragment } from "react";
import dayjs from 'dayjs';
import PropTypes from "prop-types";

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

    const selectedCdS = degrees.filter((x) => formData.cds.includes(x.cod_degree));
    const inputData = [
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
      value: selectedCdS.map((x, i) =>
      <Fragment key={x.cod_degree}>
        {`${x.cod_degree} - ${x.title_degree}`}
        {i < selectedCdS.length - 1 && <br />}
      </Fragment>
    ), },
    ];
  
    const cols = [
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
          dataSource={inputData}
          columns={cols}
          size="middle"
          showHeader={false}
          pagination={false}
        />
      </>
    );
  }

    MobReview.propTypes = {
        formData: PropTypes.object.isRequired,
        intCoSupervisors: PropTypes.array.isRequired,
        extCoSupervisors: PropTypes.array.isRequired,
        degrees: PropTypes.array.isRequired,
    }

  export { MobReview };