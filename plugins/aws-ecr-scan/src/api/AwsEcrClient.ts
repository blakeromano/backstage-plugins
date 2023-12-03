import { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api";
import { AwsEcrListImagesRequest, AwsEcrListImagesResponse, AwsEcrListScanResultsRequest, AwsEcrListScanResultsResponse } from 'plugin-aws-ecr-scan-backend';
import { AwsEcrScanApi } from "./AwsEcrApi";

export class AwsEcrClient implements AwsEcrScanApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  public async listEcrImages(req: AwsEcrListImagesRequest): Promise<AwsEcrListImagesResponse> {
    const queryString = new URLSearchParams();
    queryString.append("componentKey", req.componentKey)
    const urlSegment = `v1/images?${queryString}`;

    const items = await this.get<AwsEcrListImagesResponse>(urlSegment);
    return { 
      items: items.items
    };
  }
  public async listScanResults(req: AwsEcrListScanResultsRequest): Promise<AwsEcrListScanResultsResponse> {
    const queryString = new URLSearchParams();
    queryString.append("componentKey", req.componentKey)
    queryString.append("imageTag", req.imageTag as string)
    const urlSegment = `v1/images/results?${queryString}`;

    const results = await this.get<AwsEcrListScanResultsResponse>(urlSegment);

    return { 
      results: results.results
    };  
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('aws-ecr-scan')}/`;
    const url = new URL(path, baseUrl);

    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url.toString(), {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json() as Promise<T>;
  }

}