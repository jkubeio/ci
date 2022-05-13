const config = require('./config');
const HEADER = '<!-- Eclipse JKube CI bot report -->';

const parseMetadata = (reportComment) => {
  const metadataLine = (reportComment?.body ?? '').split('\n').filter((line) => line.indexOf('<!-- METADATA ') === 0);
  if (metadataLine.length === 1) {
    return JSON.parse(metadataLine[0].substring(14, metadataLine[0].length - 4));
  }
  return {};
};

const statusIcon = (suite) => {
  let ret = ':hourglass_flowing_sand:';
  if (suite.status === 'completed') {
    ret = suite.conclusion === 'success' ? ':heavy_check_mark:' : ':x:';
  } else if (suite.status === 'queued') {
    ret = ':hand:';
  }
  return ret;
};

const artifactSection = (artifact) => `
<details>
  <summary>${artifact.content.indexOf('[X]') < 0 ? ':heavy_check_mark:' : ':x:'} ${artifact.name}</summary>

  \`\`\`
${artifact.content}
  \`\`\`
</details>
`;

const template = ({workflowRun, jobs, artifacts, finished = false}) => {
  const metadata = {
    pr: config.pr,
    runId: config.runId
  };
  const applicableJobs = jobs.jobs.filter((job) => job.name !== 'Finish CI test run');
  applicableJobs.sort((job1, job2) => job1.name.localeCompare(job2.name));
  jobs.jobs.filter((job) => job.name === 'Finish CI test run').forEach((j) => applicableJobs.push(j));
  return `${HEADER}
<!-- METADATA ${JSON.stringify(metadata)} -->
### Eclipse JKube [CI Report](${config.ciRepoUrl})

Started new GH workflow run for https://github.com/${config.owner}/${config.repo}/pull/${config.pr} (_${
    workflowRun.updated_at
  }_)

:gear: [${workflowRun.name} (${workflowRun.id})](${workflowRun.html_url}) ${finished ? '' : statusIcon(workflowRun)}
${applicableJobs.map((job) => `- ${statusIcon(job)} [${job.name}](${job.html_url})`).join('\n')}

<details>
  <summary><h4>Test results</h4></summary>

  <blockquote>
  ${artifacts.map(artifactSection).join('\n')}
  </blockquote>
</details>
    `;
};

module.exports = {
  HEADER,
  parseMetadata,
  template
};
