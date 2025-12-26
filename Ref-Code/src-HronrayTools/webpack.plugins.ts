import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();

const envVars = {
  CHROME_PATH: process.env.CHROME_PATH ?? '',
  USER_DATA_DIR: process.env.USER_DATA_DIR ?? '',
  APP_URL: process.env.APP_URL ?? '',
};

const defineEnv = Object.fromEntries(
  Object.entries(envVars).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
);

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new webpack.DefinePlugin(defineEnv),
];
