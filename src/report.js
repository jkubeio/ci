const config = require('./config');
const HEADER = '<!-- Eclipse JKube CI bot report -->';

const parseMetadata = (reportComment) => {
  const metadataLine = (reportComment?.body ?? '').split('\n').filter((line) => line.indexOf('<!-- METADATA ') === 0);
  if (metadataLine.length === 1) {
    return JSON.parse(metadataLine[0].substr(14, metadataLine[0].length - 18));
  }
  return {};
};

const template = ({workflowRun}) => {
  const metadata = {
    pr: config.pr,
    runId: config.runId
  };
  let workflowStatus = ':hourglass_flowing_sand:';
  if (workflowRun.status === 'completed' && workflowRun.conclusion === 'success') {
    workflowStatus = ':heavy_check_mark:';
  }
  return `${HEADER}
<!-- METADATA ${JSON.stringify(metadata)} -->
### Eclipse JKube [CI Report](${config.ciRepoUrl})

Started new GH workflow run for https://github.com/${config.owner}/${config.repo}/pull/${config.pr}.

:gear: [${workflowRun.name} (${workflowRun.id})](${workflowRun.url}) ${workflowStatus}
    `;
};

module.exports = {
  HEADER,
  parseMetadata,
  template
};
