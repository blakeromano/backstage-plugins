import {
  Table,
  TableColumn,
} from "@backstage/core-components";
import { AwsEcrListScanResultsResponse } from 'plugin-aws-ecr-scan-backend';
import * as React from 'react';
import {ECR} from "aws-sdk"
import { Entity } from "@backstage/catalog-model";
import { useApi } from "@backstage/core-plugin-api";
import { awsEcrScanApiRef } from "../../api";
import { Typography } from "@material-ui/core";
import { ECR_ANNOTATION } from "../../plugin";



export const ResultsTable = (props: {imageTag: string, entity: Entity}) => {
  const [results, setResults] = React.useState<AwsEcrListScanResultsResponse>()

  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      width: '25%',
    },
    { title: 'Severity', 
      field: 'severity', 
      width: '20%', 
      defaultSort: 'desc', 
    },
    { title: 'Description', 
      field: 'description', 
      width: '30%' 
    },
    { title: 'Url',
      field: 'uri',
      width: '15%',
    },
  ];
  const api = useApi(awsEcrScanApiRef);

  React.useEffect(() => {
    async function getRes() {
      const componentKey = props.entity.metadata?.annotations?.[ECR_ANNOTATION] as string;

      const scanResults = await api.listScanResults({
          componentKey: componentKey,
          imageTag: props.imageTag,
        });

      return scanResults

    }
    if (props.imageTag !== "") {
      getRes().then(res => setResults(res))
    }
  }, [api, props.entity.metadata?.annotations, props.imageTag])

  return !!results?.results ? (
    <>
      {!results?.results?.findings?.length &&
      <Typography>No Findings Yet</Typography>
      }
      {!!results?.results?.findings?.length &&
        <Table
          title="Findings"
          options={{
            search: false,
            paging: true,
            sorting: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100, 250],
            actionsColumnIndex: -1,
          }}
          columns={columns}
          data={results?.results?.findings as ECR.ImageScanFindingList}
          localization={{
            header: {
                actions: '',
              },
            }}
            // detailPanel={rowData => {
            //   return (
            //     <StructuredMetadataTable
            //     metadata={{
            //       'Data Object': 'foo',
            //     }}
            //     />
            //     );
            //   }}
          />
        }
    </>
  ) : <></>
} 