var http = require('http');

describe('App', function(){

  it('should load without errors', function(){
    require('../main');
  });

  it('should serve static content', function(done){
    http.get('http://' + opts.h + ':' + opts.p + '/test.html', function(res){
      var data = '';
      res.on('data', c => data += c);
      res.on('end', () => data == 'works!\n' && done());
    });
  });
  
  it('should load tweets', function(done){
    this.timeout(8e3);
    var request = http.request({
      method: 'post',
      path: '/api/search',
      hostname: opts.h,
      port: opts.p,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    }, function(res){
      var data = '';
      res.on('data', c => data += c);
      res.on('end', () => { JSON.parse(data).statuses.length && done(); });
    });
    request.write(require('querystring').stringify({q:'warcraft'}));
    request.end();
  });

});
