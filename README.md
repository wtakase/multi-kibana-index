# multi_kibana_index

The project has moved to [Kibana plugin: Own Home](https://github.com/wtakase/kibana-own-home).

> This Kibana plugin enables to support multiple kibana.index. User can access own kibana.index and also group kibana.index by selecting on the plugin interface. kibana.index list will be generated based on username and LDAP roles.

---

## Requirement

You need to install [this Kibana](https://github.com/wtakase/kibana/tree/4.6-multi-kibana-index)

## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

<dl>
  <dt><code>npm start</code></dt>
  <dd>Start kibana and have it include this plugin</dd>

  <dt><code>npm run build</code></dt>
  <dd>Build a distributable archive</dd>

  <dt><code>npm run test:browser</code></dt>
  <dd>Run the browser tests in a real web browser</dd>

  <dt><code>npm run test:server</code></dt>
  <dd>Run the server tests using mocha</dd>
</dl>

For more information about any of these commands run `npm run ${task} -- --help`.
