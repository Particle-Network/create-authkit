
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
  //     config.plugins.push(codeInspectorPlugin({ bundler: 'webpack', editor: 'code' }));
  //   }

  //   return config;
  // },
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
  experimental: {
    esmExternals: false,
  }
};

export default nextConfig;
