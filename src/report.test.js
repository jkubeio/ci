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
        url: 'https://api.github.com/repos/jkubeio/ci/actions/runs/313373'
      };
      // When
      const result = report.template({workflowRun});
      // Then
      expect(result).toBe(`<!-- Eclipse JKube CI bot report -->
<!-- METADATA {"pr":"1337","runId":"313373"} -->
### Eclipse JKube [CI Report](https://github.com/jkubeio/ci)

Started new GH workflow run for https://github.com/eclipse/jkube/pull/1337.

:gear: [JKube E2E Tests Mocked (313373)](https://api.github.com/repos/jkubeio/ci/actions/runs/313373) :heavy_check_mark:
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
