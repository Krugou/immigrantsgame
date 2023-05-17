import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const MainView = () => {
  const [count, setCount] = useState(0);
  const [autoIncrementers, setAutoIncrementers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count => count + autoIncrementers);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoIncrementers]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Buy Auto Incrementer" onPress={() => setAutoIncrementers(autoIncrementers + 1)} />
    </View>
  );
};

export default MainView;
