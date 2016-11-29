let ldap = require('ldapjs');
let fetchGroups = require('./fetch_groups');
let setKibanaIndex = require('./set_kibana_index');

export default function (server, req, remoteUser, kibanaIndexSuffix, reply) {

  let config = server.config();

  if (remoteUser == kibanaIndexSuffix) {
    server.log(['plugin:multi-kibana-index', 'debug'], 'kibanaIndexSuffix = remoteUser: ' + kibanaIndexSuffix);
    setKibanaIndex(server, req, remoteUser, kibanaIndexSuffix);
    return fetchGroups(server, req, remoteUser, reply);
  }

  let ldapClient = ldap.createClient({
    url: config.get('multi_kibana_index.ldap.url')
  });
  let rolebase = config.get('multi_kibana_index.ldap.rolebase');
  let userbase = config.get('multi_kibana_index.ldap.userbase');
  let search_filter = config.get('multi_kibana_index.ldap.search_filter');
  let username_attribute = config.get('multi_kibana_index.ldap.username_attribute');
  let rolename_attribute = config.get('multi_kibana_index.ldap.rolename_attribute');

  let searchOpts = {
    scope: 'sub',
    filter: '(&' + search_filter + '(member=' + username_attribute + '=' + remoteUser + ',' + userbase + '))',
    attributes: [rolename_attribute]
  };
  let groups = [];
  ldapClient.search(rolebase, searchOpts, function (err, res) {
    if (err != undefined) {
      server.log(['plugin:multi-kibana-index', 'error'], 'LDAP search error: ' + err);
      return {};
    }

    res.on('searchEntry', function(entry) {
      server.log(['plugin:multi-kibana-index', 'debug'], 'LDAP search result: ' + entry.object[rolename_attribute]);
      groups.push(entry.object[rolename_attribute]);
    });
    res.on('error', function(err) {
      server.log(['plugin:multi-kibana-index', 'error'], 'LDAP search error: ' + err.message);
    });
    res.on('end', function(result) {
      server.log(['plugin:multi-kibana-index', 'debug'], 'LDAP search status: ' + result.status);
      server.log(['plugin:multi-kibana-index', 'debug'], 'Found LDAP groups: ' + groups.toString());
      for (var i = 0; i < groups.length; i++) {
        if (groups[i] == kibanaIndexSuffix) {
          server.log(['plugin:multi-kibana-index', 'debug'], 'kibanaIndexSuffix = group: ' + kibanaIndexSuffix);
          setKibanaIndex(server, req, remoteUser, kibanaIndexSuffix);
          return fetchGroups(server, req, remoteUser, reply);;
        }
      }
      return fetchGroups(server, req, remoteUser, reply);;
    });
  });

};
