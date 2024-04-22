describe('comments module test suite', () => {
  const ghApiData = require('./gh-api.data');
  let octokit;
  let comments;
  beforeEach(() => {
    jest.resetModules();
    octokit = {
      actions: {
        downloadArtifact: jest.fn(ghApiData.downloadArtifact),
        getWorkflowRun: jest.fn(ghApiData.getWorkflowRunCompletedSuccess),
        listJobsForWorkflowRun: jest.fn(ghApiData.listJobsForWorkflowRun),
        listWorkflowRunArtifacts: jest.fn(ghApiData.artifactsForWorkflowRun)
      },
      issues: {
        listComments: jest.fn(ghApiData.listComments),
        updateComment: jest.fn()
      }
    };
    jest.mock('@octokit/rest');
    require('@octokit/rest').Octokit.mockImplementation(() => octokit);
    comments = require('../src/comments');
  });
  test('getReportComment', async () => {
    const result = await comments.getReportComment();
    expect(octokit.issues.listComments)
      .toHaveBeenCalledWith({'owner': 'eclipse-jkube', 'repo': 'jkube', 'issue_number': "1337"});
    expect(result).toMatchObject({
      id: 13373,
      body: '<!-- Eclipse JKube CI bot report --> This is the right one!',
    });
  });
  test('updateReportComment', async () => {
    octokit.request = jest.fn(ghApiData.artifactZip);
    await comments.updateReportComment();
    expect(octokit.issues.updateComment)
      .toHaveBeenCalledWith(expect.objectContaining({
        body: expect.stringContaining('<!-- Eclipse JKube CI bot report -->')
      }));
  });
});
