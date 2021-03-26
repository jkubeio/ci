describe('config module test suite', () => {
  let config;
  beforeEach(() => {
    config = require('./config');
  });
  describe('computeAuth', () => {
    test('with no token, should throw Error', () => {
      expect(() => config.__visible_for_testing__.computeAuth([])).toThrow(
        'No environment variable ACCESS_TOKEN was found'
      );
    });
    test('with token, should return token', () => {
      expect(config.__visible_for_testing__.computeAuth()).toBe('MOCKED VALUE');
    });
  });
  describe('computeCommandLineArguments', () => {
    test('with invalid argument, should throw Error', () => {
      expect(() =>
        config.__visible_for_testing__.computeCommandLineArguments(['node', 'index.js', '--invalid'])
      ).toThrow('Invalid long argument --invalid, expected format "--flag=value"');
    });
    test('with valid arguments, should return valid object', () => {
      expect(
        config.__visible_for_testing__.computeCommandLineArguments(['node', 'index.js', '--valid=argument'])
      ).toEqual({valid: 'argument'});
    });
  });
});
