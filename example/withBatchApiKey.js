const { withStringsXml } = require('@expo/config-plugins');

module.exports = function withBatchApiKey(config) {
  return withStringsXml(config, (config) => {
    config.modResults.resources = config.modResults.resources || {};
    config.modResults.resources.string = config.modResults.resources.string || [];
    config.modResults.resources.string.push({
      _: 'your_batch_api_key_here', // Replace with your Batch API Key
      $: { name: 'BATCH_API_KEY' },
    });
    return config;
  });
};
