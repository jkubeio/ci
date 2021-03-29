const comments = require('./comments');

const actionFinish = async () => {
  await comments.updateReportComment(true);
};

module.exports = actionFinish;
