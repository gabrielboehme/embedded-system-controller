import * as React from 'react';
import { Text, Image, View, StyleSheet, Button, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native';

export default class DeviceConfigMenu extends React.Component {
  static navigationOptions = {
    title: 'Devices',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      devices: [], // Initialize the parks array in the state
    };
    this.loadDevices = this.loadDevices.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      // Only fetch devices if the array is empty
      if (this.state.devices.length === 0) {
        this.loadDevices();
      }
    });
  }

  loadDevices = async () => {
    const URL = 'https://769d-2801-84-1-2080-a047-b7b1-f4ad-349.ngrok-free.app/controller/configs';
    try {
      const response = await fetch(URL, {
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
        devices: data,
      });
    } catch (error) {
      console.log('1 ERROR');
      console.error(error);
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    const { navigate } = this.props.navigation;

    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.devices}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigate('EditDevice', { deviceId: item.device_id })}>
              <View style={styles.deviceConfigItem}>
                <View style={styles.deviceConfigInfo}>
                  <Text style={styles.device}>{item.device_id}</Text>
                  <Image source={require("../images/embedded.jpeg")} style={styles.logo}/>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  deviceConfigItem: {
  flexDirection: 'row',
  alignItems: 'center', // Align items vertically in the center
  padding: 15,
  marginBottom: 5,
  backgroundColor: '#dbfeff',
  borderRadius: 4,
  borderColor: '#dbfeff',
  borderWidth: 2,
},
deviceConfigInfo: {
  flexDirection: 'row', // Arrange text and image in a row
  alignItems: 'center', // Align items vertically in the center
},
logo: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  borderRadius: 4,
  borderColor: '#dbfeff',
  borderWidth: 2,
  marginRight: 10, // Add spacing between the image and text
},
device: {
  fontSize: 15,
  color: 'black',
  marginRight: 5, // Add some space between the image and text
},

});
