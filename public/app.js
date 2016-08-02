import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

chrome
  .setNavBackground('#222222')
  .setTabs([]);

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/multi_kibana_index/selection').then(function (resp) {
        return {
          currentKibanaIndex: resp.data.currentKibanaIndex,
          kibanaIndexPrefix: resp.data.kibanaIndexPrefix,
          username: resp.data.username,
          groups: resp.data.groups
        };
      });
    }
  }
}).when('/:suffix', {
  template,
  resolve: {
    userInfo($route, $http) {
      return $http.get('../api/multi_kibana_index/selection/' + $route.current.params.suffix).then(function (resp) {
        return {
          currentKibanaIndex: resp.data.currentKibanaIndex,
          kibanaIndexPrefix: resp.data.kibanaIndexPrefix,
          username: resp.data.username,
          groups: resp.data.groups
        };
      });
    }
  }
});

uiModules
.get('app/multi_kibana_index', [])
.controller('multiKibanaIndex', function ($scope, $route) {
  $scope.title = 'Select kibana.index';
  $scope.description = 'You can select kibana.index for personal or group use. Following candidates are listed based on your username and LDAP roles.';
  let userInfo = $route.current.locals.userInfo;
  $scope.currentKibanaIndex = userInfo.currentKibanaIndex;
  $scope.kibanaIndexPrefix = userInfo.kibanaIndexPrefix;
  $scope.username = userInfo.username;
  $scope.groups = userInfo.groups;
});
