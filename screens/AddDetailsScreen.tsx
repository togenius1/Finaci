import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import {AddDetailsNavigationType, AddDetailsRouteProp} from '../types';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {expenseActions} from '../store/expense-slice';
import {incomeActions} from '../store/income-slice';
import {useAppDispatch, useAppSelector} from '../hooks';
import Note from '../components/Menu/Note';
import Accounts from '../components/Menu/Accounts';
import Category from '../components/Menu/Category';
// import {
//   ExpenseCategory,
//   IncomeCategory,
//   TransferCategory,
// } from '../dummy/categoryItems';
// import {AccountCategory} from '../dummy/account';
import {CategoryType} from '../models/category';
import {fetchAccountsData} from '../store/account-action';
import {fetchExpenseCategoriesData} from '../store/expense-category-action';
import {fetchIncomeCategoriesData} from '../store/income-category-action';
import {fetchTransferCategoriesData} from '../store/transfer-category-action';

type Props = {
  navigation: AddDetailsNavigationType;
  route: AddDetailsRouteProp;
};

const {width, height} = Dimensions.get('window');

const AddDetailsScreen = ({route, navigation}: Props) => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(store => store);

  const amount = route.params?.amount;
  const type = type === undefined ? 'expense' : route.params?.transaction?.type;
  const categoryTitle = route.params?.transaction?.categoryTitle;
  const accountTitle = route.params?.transaction?.account;
  const d = route.params?.transaction?.date;
  const createdDate = moment(d).format('YYYY-MM-DD');

  const [textDate, setTextDate] = useState<string | null>(
    String(moment().format('YYYY-MM-DD')),
  );
  const [categoryPressed, setCategoryPressed] = useState<boolean>(false);
  const [category, setCategory] = useState();
  const [accountPressed, setAccountPressed] = useState<boolean>(false);
  const [account, setAccount] = useState();
  const [notePressed, setNotePressed] = useState<boolean>(false);
  const [note, setNote] = useState<Note>({
    note: '',
  });
  const [cateData, setCateData] = useState<CategoryType>();

  // useEffect(() => {
  //   dispatch(fetchAccountsData());
  //   // dispatch(fetchCashAccountsData());
  //   dispatch(fetchExpenseCategoriesData());
  //   dispatch(fetchIncomeCategoriesData());
  //   dispatch(fetchTransferCategoriesData());
  // }, []);

  // set initial date: from Calculator route or from Account route
  const initialDate =
    createdDate !== undefined
      ? moment(createdDate).format('YYYY-MM-DD')
      : textDate;

  const AccountCategory = dataLoaded?.accounts?.accounts;
  const ExpenseCategory = dataLoaded?.expenseCategories?.expenseCategories;
  const IncomeCategory = dataLoaded?.incomeCategories?.incomeCategories;
  const TransferCategory = dataLoaded?.transferCategories?.transferCategories;

  const accountCategoryById = AccountCategory.find(
    acc => acc.id === account?.id,
  );
  const expenseCategoryById = ExpenseCategory.find(
    cate => cate.id === category?.id,
  );
  const incomeCategoryById = IncomeCategory.find(
    cate => cate.id === category?.id,
  );
  const transferCategoryById = TransferCategory.find(
    tr => tr.id === category?.id,
  );

  useEffect(() => {
    navigation.setOptions({
      title: 'Expenses',
      headerRight: () => (
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => saveHandler()}>
          <View style={styles.saveContainer}>
            <Text style={styles.save}>Save</Text>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, amount, category, note, textDate, account]);

  useEffect(() => {
    if (type === 'expense') {
      setCateData(ExpenseCategory);
    }
    if (type === 'income') {
      setCateData(IncomeCategory);
    }
    if (type === 'transfer') {
      setCateData(TransferCategory);
    }
  }, []);

  function saveHandler() {
    if (type === 'expense') {
      dispatch(
        expenseActions.addExpense({
          id: 'expense' + uuidv4(),
          cateId: expenseCategoryById?.id,
          accountId: accountCategoryById?.id,
          amount: amount,
          note: note.note,
          date: textDate,
        }),
      );
    }
    if (type === 'income') {
      dispatch(
        incomeActions.addIncome({
          id: 'income' + uuidv4(),
          cateId: incomeCategoryById?.id,
          accountId: accountCategoryById?.id,
          amount: amount,
          note: note.note,
          date: textDate,
        }),
      );
    }
    // if (type === 'transfer') {
    //   dispatch(
    //     transferActions.addTransfer({
    //       id: 'transfer' + uuidv4(),
    //       cateId: transferCategoryById?.id,
    //       accountId: accountCategoryById?.id,
    //       amount: amount,
    //       note: note.note,
    //       date: textDate,
    //     }),
    //   );
    // }
    navigation.navigate('Overview');
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        type={type}
        amount={amount}
        category={category}
        categoryTitle={categoryTitle}
        note={note.note}
        accountTitle={accountTitle}
        // createdDate={createdDate}
        account={account}
        textDate={textDate}
        setTextDate={setTextDate}
        setCategoryPressed={setCategoryPressed}
        setNotePressed={setNotePressed}
        setAccountPressed={setAccountPressed}
        initialDate={initialDate}
      />

      {categoryPressed && (
        <Category
          setCategoryPressed={setCategoryPressed}
          setCategory={setCategory}
          data={cateData}
        />
      )}

      {notePressed && (
        <Note setNotePressed={setNotePressed} setNote={setNote} note={note} />
      )}

      {accountPressed && (
        <Accounts
          setAccount={setAccount}
          setAccountPressed={setAccountPressed}
        />
      )}
    </View>
  );
};

export default AddDetailsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  amount: {
    // alignItems: 'flex-end',
    // backgroundColor: 'red',

    position: 'absolute',
    bottom: -height / 2,
    right: width / 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  currencyContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90b9ff',
    hadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 15,
    top: 20,
  },
  currencyText: {
    fontSize: 16,
  },
  saveContainer: {
    position: 'absolute',
    right: 0,
    top: -10,
  },
  save: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.75,
  },
});
