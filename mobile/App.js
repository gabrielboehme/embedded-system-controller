import * as React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import DeviceConfigMenu from './pages/DeviceConfigMenu';
import DeviceEditView from './pages/DeviceEditView';
import DeviceLogsView from './pages/DeviceLogs';


const MainNavigator = createStackNavigator({
  Home: {screen: DeviceConfigMenu},
  EditDevice: {screen: DeviceEditView},
  DeviceLogs: {screen: DeviceLogsView},
});
 
const App = createAppContainer(MainNavigator);
export default App;