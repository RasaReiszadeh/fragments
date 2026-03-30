
const pkg = require('../../package.json');
const { hostname } = require('os');

module.exports = (req, res) => {
  const repoUrl = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  const githubUrl = (repoUrl || '').replace(/^git\+/, '').replace(/\.git$/, '');

  res.set('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author: pkg.author,
    githubUrl,
    version: pkg.version,
    hostname: hostname(),
  });
};