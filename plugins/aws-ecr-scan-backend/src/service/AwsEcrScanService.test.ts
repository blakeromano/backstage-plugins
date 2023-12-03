import { AwsEcrScan } from "./AwsEcrScanService";
import AWSMock from 'aws-sdk-mock';
import aws from 'aws-sdk';


describe("AwsEcrScanService", () => {
  beforeAll(() => {    
    AWSMock.setSDKInstance(aws);
  });
  it('should be created', () => {
    const service = new AwsEcrScan({
      awsRegion: "us-west-2"
    });
    expect(service.listEcrImages).toEqual(expect.any(Function));
  });
  it('should list ecr images', async () => {
    const images: aws.ECR.DescribeImagesResponse = {
      imageDetails: [
        {
          imageDigest: "123",
          imageTags: ["foo"]
        },
      ]
    }
    AWSMock.mock('ECR', 'describeImages', images)
    const service = new AwsEcrScan({
      awsRegion: "us-west-2"
    });
    const response = await service.listEcrImages({
      componentKey: "foobar"
    })
    expect(response.items).toEqual(images.imageDetails)
  });
  it('should list ecr scan results', async () => {
    const results: aws.ECR.DescribeImageScanFindingsResponse = {
      imageScanFindings: {
        findingSeverityCounts: {
          MEDIUM: 25,
          LOW: 12,
        },
      }
    }
    AWSMock.mock('ECR', 'describeImageScanFindings', results)
    const service = new AwsEcrScan({
      awsRegion: "us-west-2"
    });
    const response = await service.listScanResults({
      componentKey: "foobar",
      imageTag: "latest"
    })
    expect(response.results.findingSeverityCounts).toEqual(results?.imageScanFindings?.findingSeverityCounts);
  });
})