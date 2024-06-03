import React from 'react';
import { Button } from 'react-native-paper';
import { View } from 'react-native';

const FileUpload = ({ onChange }) => {

  const handleButtonClick = () => {
    document.getElementById('image').click();
  };
  
  return (
    <View>
      <input type="file" id="image" onChange={onChange} style={{ display: 'none' }} />
      <Button
        icon="cloud-upload" // Icon from react-native-paper
        mode="outlined"
        onPress={handleButtonClick}
      >
        UPLOAD AVI
      </Button>
    </View>
  );
};

export default FileUpload;
