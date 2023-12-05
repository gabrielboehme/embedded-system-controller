import * as React from 'react';
import { Text, Image, View, StyleSheet, Button, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native';


const URL = 'https://769d-2801-84-1-2080-a047-b7b1-f4ad-349.ngrok-free.app'

export default class DeviceEditView extends React.Component {
  static navigationOptions = {
    title: "Device logs",
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deviceId: this.props.navigation.getParam('deviceId')
    };
    this.loadLogs = this.loadLogs.bind(this);
    this.loadLogs();
  }

  // componentDidMount() {
  //   // const { navigation } = this.props;

  //   // this.focusListener = navigation.addListener('didFocus', () => {
  //   //   // Only fetch devices if the array is empty
  //   //   // if (this.state.device_id == null) {
  //   //     // this.loadLogs();
  //   //   // }
  //   // });
  // }


  loadLogs = async () => {
    const url = URL + '/logger/logs/' + this.state.deviceId;
    console.log("LOAD:", url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*"
        },
      });
      const data = await response.json();
      console.log('SUCCESS');
      this.setState({
        isLoading: false,
        logs: data
      });
    } catch (error) {
      console.log('ERROR');
      console.error(error);
    }
  };

  

   render() {
    
    return (
      <View style={styles.container}>
        <Text>Device Logs:</Text>
        <FlatList
          data={this.state.logs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>{item.created_at} - {item.log}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});