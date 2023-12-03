import { createRouter, AwsEcrScan } from 'plugin-aws-ecr-scan-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {

  return await createRouter({
    logger: env.logger,
    awsEcrScanService: new AwsEcrScan({
      awsRegion: "us-west-2",
    })
  });
}