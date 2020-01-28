/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Root from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import firebase from './src/config/config';

AppRegistry.registerComponent(appName, () => Root);
