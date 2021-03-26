const actionInit = async () => {
  const comments = require('./comments');
  await comments.initReportComment();
};

module.exports = actionInit;
