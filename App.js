/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import axios from 'axios';

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image,
} from 'react-native';

import Config from 'react-native-config';

const App = () => {
  const [nextUrl, setNextUrl] = useState(
    'https://dev-dummy-api.jelantah.org/api/foods/get',
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios.get(`${nextUrl}`).then(res => {
      setNextUrl(res?.data?.data?.next_page_url);
      setData([...data, ...res?.data?.data?.data]);
    });
  };

  const fetchData = () => {
    setLoading(true);

    axios
      .get('https://dev-dummy-api.jelantah.org/api/foods/get')
      .then(res => {
        setNextUrl(res?.data?.data?.next_page_url);
        setData(res?.data?.data?.data);
      })
      .catch(err => console.error('An error occurred', err))
      .finally(() => setLoading(false));
  };

  const renderItem = ({index, item}) => {
    return (
      <View style={styles.containerImage}>
        <Image
          key={0}
          style={styles.images}
          source={{
            uri: item?.url_image_absolute,
          }}
          resizeMode={'cover'}
        />
        <Text>{item?.food_name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header} />
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.containerList}
        showsVerticalScrollIndicator={false}
        vertical
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={loading}
        onRefresh={fetchData}
        onEndReachedThreshold={0.2}
        onEndReached={({distanceFromEnd}) => {
          getData();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    backgroundColor: '#cccc',
    width: '100%',
    height: 64,
  },
  flatList: {
    marginBottom: 10,
    flex: 1,
  },
  containerList: {
    padding: 24,
  },
  containerImage: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
  },
  images: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
});

export default App;
