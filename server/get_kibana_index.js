let setKibanaIndex = require('./set_kibana_index');

export default function (server, req, remoteUser) {
  try {
    let remoteUserSession = req.yar.get(remoteUser);
    return remoteUserSession.key;
  } catch (err) {
    setKibanaIndex(server, req, remoteUser, remoteUser);
    let remoteUserSession = req.yar.get(remoteUser);
    return remoteUserSession.key;
  } 
};
