import selectionRoute from './server/selection';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {
      app: {
        title: 'Multi Kibana Index',
        description: 'Support multi kibana.index',
        main: 'plugins/multi_kibana_index/app',

        injectVars: function (server, options) {
          let config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion')
          };
        }
      }
    },

    config(Joi) {
      const { array, boolean, number, object, string } = Joi;

      return object({
        enabled: boolean().default(true),
        session: object({
          secretkey: string().default('the-password-must-be-at-least-32-characters-long'),
          isSecure: boolean().default(true),
          timeout: number().default(3600000)
        }),
        ldap: object({
          url: string().default('ldap://ldap.example.com:389'),
          userbase: string().default('ou=People,dc=example,dc=com'),
          rolebase: string().default('ou=Group,dc=example,dc=com'),
          rolename_attribute: string().default('cn')
        }).default()
      }).default();
    },

    init(server, options) {
      server.register({
        register: require('yar'),
        options: {
          name: 'multi-kibana-index-session',
          cache: {
            expiresIn: server.config().get('multi_kibana_index.session.timeout')
          },
          cookieOptions: {
            password: server.config().get('multi_kibana_index.session.secretkey'),
            isSecure: server.config().get('multi_kibana_index.session.isSecure')
          }
        }
      }, function (err) {
        server.log(['plugin:multi-kibana-index', 'info'], 'Unknown error occured at the init()');
      });
      selectionRoute(server);
    }

  });
};
