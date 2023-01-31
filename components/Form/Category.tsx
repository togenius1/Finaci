import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {CategoryType} from '../../models/category';
import {expenseCategoriesActions} from '../../store/expense-category-slice';
import {incomeCategoriesActions} from '../../store/income-category-slice';

// Constants
const {width, height} = Dimensions.get('window');

const Category = ({setCategoryPressed, setCategory, type}: Props) => {
  const [categoryText, setCategoryText] = useState<string>('');
  const [filterData, setFilterData] = useState<any[]>();
  // const [addedCategory, setAddedCategory] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  let categoryData;
  if (type === 'expense') {
    categoryData = dataLoaded?.expenseCategories?.expenseCategories;
  }
  if (type === 'income') {
    categoryData = dataLoaded?.incomeCategories?.incomeCategories;
  }

  useEffect(() => {
    setFilterData(categoryData);
    searchFilterHandler(categoryText);
  }, [categoryData]);

  // Category
  function categoryHandler(item) {
    setCategory(item);
    setCategoryPressed(false);
  }

  // Add a category
  function addCategoryHandler() {
    const findCategory = categoryData?.filter(
      cate => cate.title === categoryText,
    );

    if (type === 'expense') {
      if (findCategory[0]?.title === undefined) {
        dispatch(
          expenseCategoriesActions.addExpenseCategories({
            id: 'expenseCategory-' + uuidv4(),
            title: categoryText,
            date: moment().format('YYYY-MM-DD'),
          }),
        );
      }
    }
    if (type === 'income') {
      if (findCategory[0]?.title === undefined) {
        dispatch(
          incomeCategoriesActions.addIncomeCategories({
            id: 'expenseCategory-' + uuidv4(),
            title: categoryText,
            date: moment().format('YYYY-MM-DD'),
          }),
        );
      }
    }
  }

  function searchFilterHandler(text: string) {
    if (text) {
      const newData = categoryData?.filter(item => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterData(newData);
    } else {
      setFilterData(categoryData);
    }
  }

  // Remove category
  const removeCategoryHandler = (id: string) => {
    dispatch(
      expenseCategoriesActions.deleteExpenseCategories({
        id,
      }),
    );
  };

  // Edit category
  const editCategoryHandler = (id: string) => {
    console.log('Edit: ', id);
  };

  // Render Item
  const renderItem = ({item}) => {
    return (
      <View>
        <Pressable
          key={item.title + uuidv4()}
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => categoryHandler(item)}
          onLongPress={() =>
            Alert.alert(
              'Edit or Delete?',
              'You can Edit or remove the account.',
              [
                // {
                //   text: 'Edit',
                //   onPress: () => editCategoryHandler(item?.id),
                //   // style: 'cancel',
                // },
                {
                  text: 'Delete',
                  onPress: () => removeCategoryHandler(item?.id),
                  // style: 'destructive',
                },
                {
                  text: 'Cancel',
                  // onPress: () => editAccountPressedHandler(item?.id),
                  style: 'cancel',
                },
              ],
              {
                cancelable: true,
                // onDismiss: () =>
                //   Alert.alert(
                //     'This alert was dismissed by tapping outside of the alert dialog.',
                //   ),
              },
            )
          }>
          <View style={styles.item}>
            <Text>{item.title}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={() => setCategoryPressed(false)}>
        <View style={{alignItems: 'flex-end', marginRight: 10, marginTop: 10}}>
          <Ionicons name="close" size={24} color="black" />
        </View>
      </Pressable>
      <View style={{marginLeft: 20}}>
        <Text style={{fontWeight: '800', fontSize: height * 0.02}}>
          Search:
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.9,
    height: height * 0.84,
    position: 'absolute',
    top: 20,
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
    width: width * 0.55,
    height: height * 0.05,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
  },
  item: {
    padding: height * 0.017,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  pressed: {
    opacity: 0.65,
  },
});

export default Category;

//============================ TYPE =====================================
type Dispatcher<S> = Dispatch<SetStateAction<S>>;

type Props = {
  setCategoryPressed: Dispatcher<boolean>;
  setCategory: Dispatcher<CategoryType>;
  // data: any[];
  type: string;
};
