module.exports.getPortFromFlag = () => {
    const flagIndex = process.argv.indexOf("-p");
    if (flagIndex > -1) {
        const port = parseInt(process.argv[flagIndex + 1]);
        if (port > 0 && port < 65535) {
            return port;
        }
    }
    return undefined;
};
