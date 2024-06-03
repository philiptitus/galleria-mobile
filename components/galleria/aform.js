import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AForm = ({ forgotScreen = true, resetScreen = false, value, onChange, value2, onChange2, onSubmit, value3, onChange3 }) => {
  const Submission = () => {
    onSubmit(); // Call the onSubmit function passed as a prop
  };

  return (
    <View style={styles.container}>
      {resetScreen && (
        <View>
          <Text style={styles.legend}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder='New password'
            value={value2}
            onChangeText={onChange2}
            secureTextEntry={true}
          />
          <Text style={styles.legend}>Confirm password</Text>
          <TextInput
            style={styles.input}
            placeholder='Confirm password'
            value={value3}
            onChangeText={onChange3}
            secureTextEntry={true}
          />
          <Button title='SET NEW PASSWORD' onPress={Submission} />
        </View>
      )}

      {forgotScreen && (
        <View>
          <Text style={styles.legend}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder='Enter Registered Email'
            value={value}
            onChangeText={onChange}
          />
          <Button title='SEND PASSWORD RESET LINK' onPress={Submission} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    maxWidth: 400,
    margin: 'auto',
    padding: 25,
    borderTopWidth: 10,
    borderTopColor: 'red',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  legend: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 5,
    color: '#c4825d',
  },
});

export default AForm;
