import * as React from 'react';
import { Text, TextInput, View, StyleSheet, Button } from 'react-native';

export default class DeviceEditView extends React.Component {
  static navigationOptions = {
    title: "Edit Device",
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      device_id: props.navigation.getParam('deviceConfig').device_id, // Initialize the parks array in the state
      device: {
        cooldown: 0,
        targetStart: 50,
        targetFinal: 180
      }
    };
    this.loadDevice = this.loadDevice.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      // Only fetch devices if the array is empty
      if (this.state.device_id == null) {
        this.loadDevice();
      }
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  handleSave = async () => {
    const { cooldown, targetFinal, targetStart } = this.state;

    try {
      const response = await fetch('API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
        body: JSON.stringify({
          cooldown: cooldown,
          target_final: targetFinal,
          target_start: targetStart,
        }),
      });

      if (response.ok) {
        // Handle successful update
        console.log('Fields updated successfully');
      } else {
        // Handle error
        console.error('Failed to update fields');
      }
    } catch (error) {
      console.error('Error updating fields:', error);
    }
  };

  loadDevice = async () => {
    const { navigation } = this.props;
    const URL = 'https://8ef8-2804-4d98-244-d800-51af-f44-1b3-97ab.ngrok-free.app/configs/' + navigation.state.device_id;
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
        device: {
          cooldown: data.cooldown,
          targetStart: data.target_start,
          targetFinal: data.target_final,
        },
      });
    } catch (error) {
      console.log('ERROR');
      console.error(error);
    }
  };

   render() {
    return (
      <View style={styles.container}>
        <Text>Edit Device Fields:</Text>
        <TextInput
          style={styles.input}
          value={this.state.device.cooldown}
          onChangeText={(text) => this.setState({ cooldown: text })}
          placeholder="Cooldown"
        />
        <TextInput
          style={styles.input}
          value={this.state.device.targetFinal}
          onChangeText={(text) => this.setState({ targetFinal: text })}
          placeholder="Target Final"
        />
        <TextInput
          style={styles.input}
          value={this.state.device.targetStart}
          onChangeText={(text) => this.setState({ targetStart: text })}
          placeholder="Target Start"
        />
        <Button title="Save" onPress={this.handleSave} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
});
