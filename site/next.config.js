/** @type {import('next').NextConfig} */
module.exports = {
  // Target must be serverless
  target: "serverless",
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      // add more routes here
    };
  },
  // Add this configuration
  output: 'export',
};
