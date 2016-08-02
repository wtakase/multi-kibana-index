let ldap = require('ldapjs');
let fetchGroups = require('./fetch_groups');
let validateKibanaIndex = require('./validate_kibana_index');
let getKibanaIndex = require('./get_kibana_index');

export default function (server) {

  let config = server.config();

  server.route({
    path: '/api/multi_kibana_index/selection/{suffix?}',
    method: 'GET',
    handler(req, reply) {
      let kibanaIndexSuffix = req.params.suffix ? encodeURIComponent(req.params.suffix) : '';
      if (config.get('elasticsearch.handleMultiIndices') && config.get('elasticsearch.proxyUserHeader') in req.headers) {
        let remoteUser = req.headers[config.get('elasticsearch.proxyUserHeader')];
        let currentKibanaIndex = getKibanaIndex(server, req, remoteUser);
        if (kibanaIndexSuffix !== '') {
          validateKibanaIndex(server, req, remoteUser, kibanaIndexSuffix, reply);
        } else {
          fetchGroups(server, req, remoteUser, reply);
        }
      } else {
        reply({
          currentKibanaIndex: config.get('kibana.index'),
          kibanaIndexPrefix: '',
          username: '',
          groups: ''
        });
      }
    }
  });

};
