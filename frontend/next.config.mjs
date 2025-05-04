/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加Semi UI到转译包列表
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-foundation'],
};

export default nextConfig;
