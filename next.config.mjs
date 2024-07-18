/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add a rule for .node files
        config.module.rules.push({
          test: /\.node$/,
          use: 'node-loader'
        });
    
        // Fix for native modules
        config.resolve.extensions.push('.node');
    
        // Ensure the binary module is excluded from client-side bundling
        if (!isServer) {
          config.externals = {
            'onnxruntime-node': 'commonjs onnxruntime-node'
          };
        }
    
        return config;
      },
    typescript: {
      ignoreBuildErrors: true,
    }
};

export default nextConfig;
