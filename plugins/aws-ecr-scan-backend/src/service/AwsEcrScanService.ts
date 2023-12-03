/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AwsEcrListImagesRequest,
  AwsEcrListImagesResponse,
  AwsEcrScanService,
  AwsEcrListScanResultsRequest,
  AwsEcrListScanResultsResponse,
} from './types';
import {
  ECR
} from "aws-sdk"

/** @public */
export type AwsEcrScanServiceOptions = {
  awsRegion: string
};

/** @public */
export class AwsEcrScan implements AwsEcrScanService {
  private readonly ecrClient: ECR

  constructor(options: AwsEcrScanServiceOptions) {
    this.ecrClient = new ECR({
      region: options.awsRegion,
    })
  }

  async listEcrImages(
    req: AwsEcrListImagesRequest,
  ): Promise<AwsEcrListImagesResponse> {

    const images = await this.ecrClient.describeImages({
      repositoryName: req.componentKey,
      maxResults: 100,
    }).promise()

    return {
      items: images.imageDetails as ECR.ImageDetailList,
    };
  }

  async listScanResults(
    req: AwsEcrListScanResultsRequest,
  ):  Promise<AwsEcrListScanResultsResponse> {

    const results = await this.ecrClient.describeImageScanFindings({
      imageId: {
        imageDigest: req.imageDigest,
        imageTag: req.imageTag,
      },
      repositoryName: req.componentKey,
      maxResults: 1000,
    }).promise()


    return {
      results: results.imageScanFindings as ECR.ImageScanFindings
    }
  }
}