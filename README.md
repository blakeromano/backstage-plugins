# Backstage Plugins

## AWS ECR Scan Results Plugin

This plugin is meant to allow you to view ECR Scan Results for a specific entity within your Backstage UI. 

This requires that where you run Backstage has AWS Credentials that has IAM Permissions to describe images and get ECR scan findings (through enviornment variables, IRSA, etc;).

### Setup AWS ECR Scan Results Plugin

Create a file in `packages/backend/src/plugins/aws-ecr-scan.ts`

```typescript
import { createRouter, AwsEcrScan } from 'plugin-aws-ecr-scan-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
// ...
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {

  return await createRouter({
    logger: env.logger,
    awsEcrScanService: new AwsEcrScan({
      awsRegion: "us-west-2", // insert region you want to use here
    })
  });
}
```


In `packages/backend/src/index.ts` add the following:

```typescript
import awsEcrScan from './plugins/aws-ecr-scan';
// ...
async function main() {
  // ...
  const awsEcrScanEnv = useHotMemoize(module, () => createEnv('aws-ecr-scan'));
  const apiRouter = Router();
  apiRouter.use('/aws-ecr-scan', await aws(awsEcrScanEnv));
  // ...
}
```

That will setup the backend portion of the plugin! To setup the frontend:

Edit the `packages/app/src/components/catalog/EntityPage.tsx` and add the imports

```typescript jsx
import {
  EntityEcrScanResultsContent, 
  isAwsEcrScanResultsAvailable 
} from 'plugin-aws-ecr-scan';
```

Then add the following components:

```typescript jsx
  <EntityLayout.Route path="/ecr-scan" title="Image Scan" if={isAwsEcrScanResultsAvailable}>
    <EntityEcrScanResultsContent />
  </EntityLayout.Route>
```

Now any entities with the `aws.com/ecr-repository-name` annotation will have a new tab on their entity page to show their ECR Scan Results!