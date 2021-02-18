import JSTracker from '../src/index';

test('Runs without crashing', () => {
  new JSTracker({
    apiKey: "asdf",
    endpoint: '/api',
    async: true,
    debug: true
  });
});
