import {StyleSheet, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../hooks';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import IconButton from '../components/UI/iconButton';
import {GlobalStyles} from '../constants/styles';
import {expenseActions} from '../store/expenses-slice';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {
  ExpensesModel,
  ManageExpenseScreenNavigationProp,
  ManageExpenseScreenRouteProp,
} from '../types';

type Props = {
  navigation: ManageExpenseScreenNavigationProp;
  route: ManageExpenseScreenRouteProp;
};

const ManageExpenseScreen = ({navigation, route}: Props) => {
  const dispatch = useAppDispatch();

  const editedExpenseId: string = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpenseRedux = useAppSelector(store => store);

  const selectedExpense = selectedExpenseRedux.expenses.find(
    expense => expense.id === editedExpenseId,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [isEditing, navigation]);

  function deleteExpenseHandler() {
    dispatch(expenseActions.deleteExpense(editedExpenseId));
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler(expenseData: ExpensesModel) {
    if (isEditing) {
      dispatch(
        expenseActions.updateExpense({
          id: editedExpenseId,
          category: expenseData.category,
          amount: expenseData.amount,
          date: expenseData.date.toISOString(),
          description: expenseData.description,
        }),
      );
    } else {
      const addId: string = uuidv4();
      dispatch(
        expenseActions.addExpense({
          id: addId,
          category: expenseData.category,
          amount: expenseData.amount,
          date: expenseData.date.toISOString(),
          description: expenseData.description,
        }),
      );
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            name="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
};

export default ManageExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: GlobalStyles.colors.primary800,
    backgroundColor: 'white',
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});
