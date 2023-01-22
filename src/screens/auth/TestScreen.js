import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper';
const TestScreen = () => {
  return (
    <View style={styles.container}>
        <Button>
          <Text style={{color: 'black'}}>
          전송
          </Text>      
          </Button>
    </View>
    
  )
}

export default TestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})