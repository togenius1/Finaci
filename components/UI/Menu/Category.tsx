import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAppDispatch} from '../../../hooks';
import {categoryActions} from '../../../store/category-slice';

type Props = {};

const {width, height} = Dimensions.get('window');

const Category = ({
  setCategoryPressed,
  setCategory,
  data,
  categoryTitle,
}: Props) => {
  const [categoryText, setCategoryText] = useState<string>('');
  const [filterData, setFilterData] = useState<object | null>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setFilterData(data);
  }, []);

  const renderItem = ({item}) => {
    console.log(item);
    return (
      <View>
        <Pressable
          key={item.title + uuidv4()}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => categoryHandler(item)}>
          <View style={styles.item}>
            <Text>{item.title}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  function categoryHandler(item) {
    setCategory(item);
    setCategoryPressed(false);
  }
  function addCategoryHandler() {
    dispatch(
      categoryActions.addCategory({
        id: 'category' + uuidv4(),
        category: categoryText,
        date: new Date(),
      }),
    );
  }

  function searchFilterHandler(text) {
    if (text) {
      const newData = data.filter(item => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterData(newData);
    } else {
      setFilterData(data);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setCategoryPressed(false)}>
        <View style={{alignItems: 'flex-end', marginRight: 10, marginTop: 10}}>
          <Ionicons name="close" size={24} color="black" />
        </View>
      </Pressable>
      <View style={{marginLeft: 35}}>
        <Text>Search:</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="search or add category"
          onChange={event => {
            searchFilterHandler(event.nativeEvent.text);
          }}
          onChangeText={setCategoryText}
          value={filterData}
        />
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => addCategoryHandler()}>
          <Text style={{fontWeight: '800', color: '#0439c2'}}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        keyExtractor={item => item.title + uuidv4()}
        data={filterData}
        renderItem={renderItem}
        bounces={false}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.9,
    height: height * 0.7,
    position: 'absolute',
    top: 50,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: 'white',
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
    // backgroundColor: '#facece',
  },
  textInput: {
    width: 200,
    height: 25,
    marginRight: 20,
    marginLeft: 35,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
  },
  item: {
    padding: 15,
    marginTop: 5,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  pressed: {
    opacity: 0.65,
  },
});
