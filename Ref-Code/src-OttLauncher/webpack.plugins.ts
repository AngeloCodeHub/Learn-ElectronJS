import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();

const envVars = {
  // CHROME_PATH: process.env.CHROME_PATH ?? '',
  USER_DATA_DIR: process.env.USER_DATA_DIR ?? '',
  USER_DATA_Src: process.env.USER_DATA_Src ?? '',
  USER_DATA_Profile: process.env.USER_DATA_Profile ?? '',
  APP_URL: process.env.APP_URL ?? '',
  // For packaged WinRAR restore flow
  // RAR_PATH: process.env.RAR_PATH ?? '',
  // compress_Pass: process.env.compress_Pass ?? '',
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
