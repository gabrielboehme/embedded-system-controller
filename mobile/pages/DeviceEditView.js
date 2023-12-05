import * as React from 'react';
import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Alert } from 'react-native';

const URL = 'https://769d-2801-84-1-2080-a047-b7b1-f4ad-349.ngrok-free.app'

export default class DeviceLogsView extends React.Component {
  static navigationOptions = {
    title: "Edit Device",
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deviceId: this.props.navigation.getParam('deviceId'),
      device: {
        cooldown: 0,
        targetRest: 50,
        targetFinal: 180,
      }
    };
    this.loadDevice = this.loadDevice.bind(this);
    this.loadDevice();
  }

  // componentDidMount() {
  //   // const { navigation } = this.props;

  //   // this.focusListener = navigation.addListener('didFocus', () => {
  //   //   // Only fetch devices if the array is empty
  //   //   // if (this.state.device_id == null) {
  //   //     // this.loadDevice();
  //   //   // }
  //   // });
  // }


  handleSave = async () => {
    const url = URL + '/controller/configs/' + this.state.deviceId;
    console.log("SAVE: ", url)
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
        body: JSON.stringify({
          cooldown: parseInt(this.state.device.cooldown),
          target_final: parseInt(this.state.device.targetFinal),
          target_rest: parseInt(this.state.device.targetRest),
        }),
      });

      if (response.ok) {
        // Handle successful update
        console.log('Fields updated successfully');
        Alert.alert('Success', 'Fields updated successfully');
      } else {
        // Handle error
        console.log(response)
        console.error('Failed to update fields');
        Alert.alert('Error', 'Failed to update fields: ' + response.status);
      }
    } catch (error) {
      console.error('Error updating fields:', error);
      Alert.alert('Error', 'Error updating fields');
    }
  };

  loadDevice = async () => {
    const url = URL + '/controller/configs/' + this.state.deviceId;
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
        device: {
          cooldown: data.cooldown,
          targetRest: data.target_rest,
          targetFinal: data.target_final,
        },
      });
    } catch (error) {
      console.log('ERROR');
      console.error(error);
    }
  };

   render() {

    const { navigate } = this.props.navigation;

     console.log(this.state);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Edit Device Fields:</Text>
          
          <Text style={styles.inputTitle}>Cooldown duration:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState(prevState => ({
              device: {
                ...prevState.device,
                cooldown: text,
              },
            }))}
            value={this.state.device.cooldown.toString()}
            keyboardType="numeric"
          />
          <Text style={styles.inputTitle}>Target Rest:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState(prevState => ({
              device: {
                ...prevState.device,
                targetRest: text,
              },
            }))}
            value={this.state.device.targetRest.toString()}
            keyboardType="numeric"
          />
          <Text style={styles.inputTitle}>Target Final:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState(prevState => ({
              device: {
                ...prevState.device,
                targetFinal: text,
              },
            }))}
            value={this.state.device.targetFinal.toString()}
            keyboardType="numeric"
          />
          <Button title="Save" onPress={this.handleSave} />
          <Button title="See device logs" onPress={() => navigate('DeviceLogs', { deviceId: this.state.deviceId })}/>
        </View>
      </TouchableWithoutFeedback>

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
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: 40,
    margin: 12,
  },
  inputTitle: {
    color: 'black',
    borderWidth: 3,
    borderColor: 'transparent',
    padding: 0,
    marginBottom: 0,
    width: '100%',
    marginTop: 15,
  }
});
