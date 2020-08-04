import {Animated, Platform, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

export function ModalLite({
  modalHeight = 0,
  duration = 0,
  backgroundColor = '',
  children,
  isVisible = false,
  onOpened,
  onClose,
}) {
  const [bounceValue, setBounceValue] = useState(
    new Animated.Value(modalHeight),
  );
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isHidden, setIsHidden] = useState(!isVisible);
  useUpdateEffect(() => {
    isHidden ? close() : open();
  }, [isHidden]);
  useUpdateEffect(() => {
    setIsHidden(!isVisible);
  }, [isVisible]);
  function open() {
    let toPositionY = modalHeight;
    let toOpacity = 0;

    toPositionY = 0;
    toOpacity = 0.6;

    Animated.parallel([
      Animated.timing(bounceValue, {
        toValue: toPositionY,
        duration: duration,
        useNativeDriver: true,
        // velocity: 3,
        // tension: 2,
        // friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: toOpacity,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // trigger opened when open animation finished
      onOpened();
    });
    setIsHidden(false);
  }

  function close() {
    const toPositionY = modalHeight;
    const toOpacity = 0;

    Animated.parallel([
      Animated.timing(bounceValue, {
        toValue: toPositionY,
        duration: duration,
        useNativeDriver: true,
        // velocity: 3,
        // tension: 2,
        // friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: toOpacity,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start();
    setIsHidden(true);
  }
  return (
    <View
      pointerEvents={isHidden ? 'none' : 'box-none'}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: Platform.OS === 'android' ? 30 : 0,
      }}>
      <Animated.View
        pointerEvents={isHidden ? 'none' : 'auto'}
        // onPress={() => this.close()}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000',
          opacity: fadeAnim,
          elevation: Platform.OS === 'android' ? 50 : 0,
        }}>
        {isHidden ? null : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onClose();
            }}
            style={{flex: 1}}
          />
        )}
      </Animated.View>

      <Animated.View
        pointerEvents={isHidden ? 'none' : 'auto'}
        style={[
          {
            position: 'absolute',
            height: modalHeight,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: backgroundColor,
            elevation: Platform.OS === 'android' ? 80 : 0,
          },
          {transform: [{translateY: bounceValue}]},
        ]}>
        {children}
      </Animated.View>
    </View>
  );
}
