let ldap = require('ldapjs');
let getKibanaIndex = require('./get_kibana_index');

export default function (server, req, remoteUser, reply) {

  let config = server.config();

  let ldapClient = ldap.createClient({
    url: config.get('multi_kibana_index.ldap.url')
  });
  let rolebase = config.get('multi_kibana_index.ldap.rolebase');
  let userbase = config.get('multi_kibana_index.ldap.userbase');
  let search_filter = config.get('multi_kibana_index.ldap.search_filter');
  let username_attribute = config.get('multi_kibana_index.ldap.username_attribute');
  let rolename_attribute = config.get('multi_kibana_index.ldap.rolename_attribute');
  let adfs = config.get('multi_kibana_index.ldap.adfs');
  let adfs_nested = '';
  if (adfs) {
    adfs_nested = ':1.2.840.113556.1.4.1941:';
  }

  let searchOpts = {
    scope: 'sub',
    filter: '(&' + search_filter + '(member' + adfs_nested + '=' + username_attribute + '=' + remoteUser + ',' + userbase + '))',
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
      if (entry.object[rolename_attribute] !== remoteUser) {
        groups.push(entry.object[rolename_attribute]);
      }
    });
    res.on('error', function(err) {
      server.log(['plugin:multi-kibana-index', 'error'], 'LDAP search error: ' + err.message);
    });
    res.on('end', function(result) {
      server.log(['plugin:multi-kibana-index', 'debug'], 'LDAP search status: ' + result.status);
      server.log(['plugin:multi-kibana-index', 'debug'], 'Found LDAP groups: ' + groups.toString());
      reply({
        currentKibanaIndex: getKibanaIndex(server, req, remoteUser),
        kibanaIndexPrefix: config.get('kibana.index'),
        username: remoteUser,
        groups: groups
      });
    });
  });

};
