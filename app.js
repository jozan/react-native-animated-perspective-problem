import React, { Component } from 'react'
import { AppRegistry, Text, ScrollView, View, StyleSheet, PanResponder, Animated } from 'react-native'

const YES = () => true

export default class Card extends Component {
  rotation = new Animated.ValueXY()
  defaultValue = { x: 0, y: 0 }

  rotate(value) {
    Animated.spring(this.rotation, {
      toValue: value,
      tension: 1,
      friction: 1,
      useNativeDriver: true
    }).start()
  }

  createPanResponder = () =>
    PanResponder.create({
      onMoveShouldSetResponderCapture: YES, // Allowing the movement
      onMoveShouldSetPanResponderCapture: YES, // Allow dragging
      onPanResponderGrant: (e, gestureState) => {
        this.rotation.setOffset({ x: this.defaultValue.x, y: this.defaultValue.y })
        this.rotation.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event([null, { dx: this.rotation.x, useNativeDriver: true }]), // Creates a function to handle the movement and set offsets
      onPanResponderTerminate: () => {
        this.rotate(0)
        this.rotation.flattenOffset()
      },
      onPanResponderRelease: () => {
        this.rotate(0)
        this.rotation.flattenOffset() // Flatten the offset so it resets the default positioning
      }
    })

  componentWillMount() {
    this.rotation.addListener(value => (this.defaultValue = value))
    this.panResponder = this.createPanResponder()
  }

  render() {
    const interpolatedRotation = this.rotation.x.interpolate({
      inputRange: [-360, 0, 360],
      outputRange: ['-360deg', '0deg', '360deg'],
      extrapolate: 'clamp'
    })

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.drag,
            {
              transform: [{ rotateY: interpolatedRotation }]
            }
          ]}
          {...this.panResponder.panHandlers}
        >
          <Text style={styles.text}>Drag me</Text>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD2A4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drag: {
    width: 200,
    height: 200,
    backgroundColor: '#7D5D4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24
  },
  text: {
    fontWeight: '800',
    fontSize: 25,
    color: '#fff'
  }
})

AppRegistry.registerComponent('AnimatedPerspectiveProblem', () => Card)
