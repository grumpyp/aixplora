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
  // Add the output configuration
  output: {
    // Configure the export options
    exportTrailingSlash: true,
    // Other export options can be added here
  },
};
