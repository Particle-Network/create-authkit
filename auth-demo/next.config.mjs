import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config, options) => {
  //   const { dev } = options;

  //   if (!dev) {
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'static',
  //         reportFilename: 'report.html',
  //         openAnalyzer: false,
  //       })
  //     );
  //   } else {
  //     config.plugins.push(codeInspectorPlugyarnin({ bundler: 'webpack', editor: 'code' }));
  //   }

  //   return config;
  // },

  webpack: (config) => {
    config.resolve.alias['react'] = path.resolve(__dirname, '../node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, '../node_modules/react-dom');
    return config;
  },
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
  experimental: {
    esmExternals: false,
  }
};

export default nextConfig;
