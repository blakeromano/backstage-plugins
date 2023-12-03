/*
 * Copyright 2022 The Backstage Authors
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
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { AwsEcrScanService } from './types';


export interface RouterOptions {
  logger: Logger;
  awsEcrScanService: AwsEcrScanService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/v1/images', async (req, res) => {
    try {
      const componentKey = req.query.componentKey as string;
      logger.info(`Grabbing Images for ${componentKey}`)
      const images = await options.awsEcrScanService.listEcrImages(
        {
          componentKey,
        })
        
        res.json(images);
      } catch (error) {
        logger.error(error)
        res.json({
          error: error,
        })
      }
  })

  router.get('/v1/images/results', async (req, res) => {
    try {
      const componentKey = req.query.componentKey as string;
      const imageTag = req.query?.imageTag as string;
      logger.info(`Grabbing Scan Results for ${componentKey}:${imageTag}`)
      const scanResults = await options.awsEcrScanService.listScanResults(
        {
          componentKey,
          imageTag,
        })
        
        res.json(scanResults);
      } catch (error) {
        logger.error(error)
        res.json({
          error: error,
        })
      }
  })

  router.use(errorHandler());
  return router;
}
