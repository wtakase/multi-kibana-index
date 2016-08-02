export default function (server, req, remoteUser, suffix) {
  req.yar.set(remoteUser, { key: server.config().get('kibana.index') + '_' + suffix });
};
