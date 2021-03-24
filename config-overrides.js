module.exports = function override(config, env) {
    config.plugins = config.plugins.map((plugin) => {
        if (plugin.constructor.name === "InjectManifest") {
            plugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024;
        }
        return plugin;
    });

    return config;
};
