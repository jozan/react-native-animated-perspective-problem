import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  ScrollView,
  View,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  rotate(value) {
    Animated.spring(this._animatedValue, {
      toValue: value,
      tension: 1,
      friction: 1,
    }).start();
  }

  componentWillMount() {
    this._animatedValue = new Animated.ValueXY()
    this._value = { x: 0, y: 0 }

    this._animatedValue.addListener((value) => this._value = value);
    this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
        onPanResponderGrant: (e, gestureState) => {
          this._animatedValue.setOffset({ x: this._value.x, y: this._value.y });
          this._animatedValue.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([
          null, { dx: this._animatedValue.x }
        ]), // Creates a function to handle the movement and set offsets
        onPanResponderTerminate: () => {
          this.rotate(0)
          this._animatedValue.flattenOffset();
        },
        onPanResponderRelease: (evt, { vx, dx }) => {
          this.rotate(vx > -1 ? -180 : 0)
          this._animatedValue.flattenOffset(); // Flatten the offset so it resets the default positioning
        }
      });
  }

  render() {
    const interpolatedRotateAnimation = this._animatedValue.x.interpolate({
      inputRange: [-360, 0, 360],
      outputRange: ['-360deg', '0deg', '360deg'],
      extrapolate: 'clamp'
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.drag,
            {
              transform: [
                { perspective: 400 },
                { rotateY: interpolatedRotateAnimation },
              ],
            }
          ]}
          {...this._panResponder.panHandlers}
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
    alignItems: 'center',
  },
  drag: {
    width: 200,
    height: 200,
    backgroundColor: '#7D5D4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  text: {
    fontWeight: '800',
    fontSize: 25,
    color: 'white'
  },
});

AppRegistry.registerComponent('AnimatedPerspectiveProblem', () => Card);
