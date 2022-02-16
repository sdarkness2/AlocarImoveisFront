const proxy = [
  {
    context: '/api',
    target: 'http://localhost:5001',
    pathRewrite: {'^/api' : ''}
  }
];
module.exports = proxy;
