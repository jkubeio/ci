describe('report module test suite', () => {
  let report;
  beforeEach(() => {
    report = require('./report');
  });
  describe('template', () => {
    test('With completed workflow run', () => {
      // Given
      const workflowRun = {
        id: 313373,
        name: 'JKube E2E Tests Mocked',
        event: 'repository_dispatch',
        status: 'completed',
        conclusion: 'success',
        url: 'https://api.github.com/repos/jkubeio/ci/actions/runs/313373',
        html_url: 'https://github.com/jkubeio/ci/actions/runs/313373'
      };
      const jobs = {
        total_count: 2,
        jobs: [
          {id: 13371, html_url: 'https://github.com/jkubeio/ci/runs/13371', name: 'Job 1'},
          {
            id: 13372,
            html_url: 'https://github.com/jkubeio/ci/runs/13372',
            name: 'Job 2',
            status: 'completed',
            conclusion: 'failure'
          },
          {id: 13373, html_url: 'https://github.com/jkubeio/ci/runs/13373', name: 'Finish CI test run'}
        ]
      };
      // When
      const result = report.template({workflowRun, jobs});
      // Then
      expect(result).toBe(`<!-- Eclipse JKube CI bot report -->
<!-- METADATA {"pr":"1337","runId":"313373"} -->
### Eclipse JKube [CI Report](https://github.com/jkubeio/ci)

Started new GH workflow run for https://github.com/eclipse/jkube/pull/1337.

:gear: [JKube E2E Tests Mocked (313373)](https://github.com/jkubeio/ci/actions/runs/313373) :heavy_check_mark:
- :hourglass_flowing_sand: [Job 1](https://github.com/jkubeio/ci/runs/13371)
- :x: [Job 2](https://github.com/jkubeio/ci/runs/13372)
    `);
    });
  });
  describe('parseMetadata', () => {
    test('with valid comment, should return metadata', () => {
      // Given
      const comment = {
        user: {
          login: 'manusa'
        },
        body: `<!-- Eclipse JKube CI bot report -->
<!-- METADATA {"pr":"1337","runId":"313373"} -->
Other stuff
`
      };
      // When
      const result = report.parseMetadata(comment);
      // Then
      expect(result).toEqual({
        pr: '1337',
        runId: '313373'
      });
    });
  });
});
