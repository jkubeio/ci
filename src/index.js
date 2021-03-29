const actions = {
  checkout: require('./action-checkout'),
  finish: require('./action-finish'),
  init: require('./action-init'),
  'update-status': require('./action-update-status')
};

const exec = async () => {
  if (process.argv.length < 3 && !actions[process.argv[2]]) {
    throw new Error('Invalid run, you need to specify the action "node index.js <actionName>"');
  }
  await actions[process.argv[2]]();
};

exec()
  .then(() => {
    console.log('Process completed!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error while running JKube CI automation');
    console.error(err);
    process.exit(1);
  });
