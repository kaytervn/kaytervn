import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface StoryProgressProps {
  storiesCount: number;
  currentIndex: number;
  duration: number;
  onComplete: () => void;
  paused: boolean;
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  storiesCount,
  currentIndex,
  duration,
  onComplete,
  paused,
}) => {
  const [progressBars, setProgressBars] = useState<Animated.Value[]>([]);
  const activeProgressRef = useRef<Animated.Value>();

  useEffect(() => {
    // Initialize progress bars
    const initialProgressBars = Array(storiesCount).fill(0).map(() => new Animated.Value(0));
    setProgressBars(initialProgressBars);
  }, [storiesCount]);

  useEffect(() => {
    // Set previous bars to 100%
    progressBars.forEach((progress, index) => {
      if (index < currentIndex) {
        progress.setValue(1);
      } else if (index > currentIndex) {
        progress.setValue(0);
      }
    });

    // Animate current bar
    if (progressBars[currentIndex]) {
      activeProgressRef.current = progressBars[currentIndex];
      startProgress();
    }
  }, [currentIndex, progressBars, paused]);

  const startProgress = () => {
    if (!activeProgressRef.current) return;

    activeProgressRef.current.setValue(0);
    Animated.timing(activeProgressRef.current, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) {
        onComplete();
      }
    });
  };

  return (
    <View style={styles.progressContainer}>
      {progressBars.map((progress, index) => (
        <View key={index} style={styles.progressWrapper}>
          <Animated.View
            style={[
              styles.progress,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 10,
    gap: 4,
  },
  progressWrapper: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default StoryProgress;