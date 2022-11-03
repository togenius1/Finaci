import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {currencyFormatter} from '../util/currencyFormatter';
import {useNavigation, useRoute} from '@react-navigation/native';

type Props = {
  nextScreen: string;
};

const {width, height} = Dimensions.get('window');

const del = (
  <MaterialCommunityIcons name="backspace" size={35} color="#000000" />
);
const sigma = <MaterialCommunityIcons name="sigma" size={35} color="#000000" />;

const next = (
  <MaterialCommunityIcons name="chevron-right" size={40} color="#001780" />
);

const ops = ['/', '*', '-', '+'];

// #########################################################################
//--------------------- START FUNCTION -------------------------------------
//#########################################################################

const Calculator = ({nextScreen, transaction}: Props) => {
  const route = useRoute();
  const amount = route.params?.amount;

  const [resultText, setResultText] = useState<string>('0');
  const [calculatedText, setCalculatedText] = useState<string | null>(
    amount !== null || undefined ? amount : '0',
  );
  const [sigmaPressed, setSigmaPressed] = useState<boolean>(false);
  const [equalPressed, setEqualPressed] = useState<boolean>(true);

  const nextOrEq = sigmaPressed ? '=' : next;

  const numeric = [
    '7',
    '8',
    '9',
    del,
    '4',
    '5',
    '6',
    'C',
    '1',
    '2',
    '3',
    sigma,
    '.',
    '0',
    '00',
    nextOrEq,
  ];

  const navigation = useNavigation();

  function validate() {
    const text = resultText;
    switch (text.slice(-1)) {
      case '+':
      case '-':
      case '*':
      case '/':
        return false;
    }
    return true;
  }

  function calculator() {
    const text = resultText;
    if (eval(text) === undefined) {
      setCalculatedText('0');
      return;
    }
    setCalculatedText(eval(text));
  }

  function clearScreen() {
    setResultText('0');
    setCalculatedText('0');
    setSigmaPressed(false);
    setEqualPressed(true);
  }

  function clearToGo() {
    setCalculatedText('0');
    setSigmaPressed(false);
    setEqualPressed(true);
  }

  function buttonPressed(text) {
    if (text === del) {
      operate('del');
      return;
    }
    if (text === 'C') {
      operate('C');
      return;
    }
    if (text === sigma) {
      operate('sigma');
      if (sigmaPressed === true) {
        setResultText('0');
        setCalculatedText('0');
      }
    }
    if (text === next) {
      operate('next');
      return;
    }
    if (text === '=') {
      operate('sigma');
      operate('equalPressed');
      return validate() && calculator();
    }
    //----------------------------------------------------------------
    if (text !== '=' && text !== sigma && !sigmaPressed) {
      const splitText = resultText.split(/[^0-9\.]+/);
      if (text === '.' && splitText[splitText.length - 1].includes('.')) {
        setResultText(resultText);
        return;
      }
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');

      setResultText(result);
    }
    //----------------------------------------------------------------
    if (text !== '=' && text !== sigma && sigmaPressed) {
      const splitText = resultText.split(/[^0-9\.]+/);
      if (text === '.' && splitText[splitText.length - 1].includes('.')) {
        setResultText(resultText);
        return;
      }
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');

      setResultText(result);
    }
  }

  function operate(operation: string) {
    switch (operation) {
      case 'del':
        const text = resultText.split('');
        text.pop();
        setResultText(text.join(''));
        break;
      case 'C':
        clearScreen();
        break;
      case 'sigma':
        setSigmaPressed(!sigmaPressed);
        setEqualPressed(true);
        break;
      case 'equalPressed':
        setEqualPressed(false);
        setSigmaPressed(false);
        break;
      case 'next':
        gotoNextScreen();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        const lastChar = resultText.split('').pop();
        if (ops.indexOf(lastChar) > 0) {
          return;
        }
        if (resultText === '') {
          return;
        }
        setResultText(resultText + operation);
        break;
    }
  }

  let calculatedValue: string | null | undefined;

  if (sigma && !sigmaPressed) {
    calculatedValue = eval(resultText);
  }
  // if (sigma && sigmaPressed) {
  //   calculatedValue = calculatedText;

  // }

  function gotoNextScreen() {
    navigation.navigate(nextScreen, {
      amount: calculatedValue,
      transaction: transaction,
      fromCalculator: true,
    });
    clearToGo();
  }

  return (
    <View style={{flex: 1}}>
      {/* <Pressable
        onPress={() => {}}
        style={({pressed}) => pressed && styles.pressed}>
        <View style={styles.currencyContainer}>
          <Text style={styles.currencyText}>$</Text>
        </View>
      </Pressable> */}

      {(sigmaPressed || !equalPressed) && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultText}</Text>
        </View>
      )}
      <View style={styles.calculatedContainer}>
        {sigmaPressed || !equalPressed ? (
          <Text style={styles.calculatedText}>{eval(calculatedText)}</Text>
        ) : (
          <Text style={styles.calculatedText}>{eval(resultText)}</Text>
        )}
      </View>

      {sigmaPressed && (
        <View style={styles.opsContainer}>
          {ops.map(value => (
            <Pressable
              key={value + Math.random()}
              onPress={() => operate(value)}
              style={({pressed}) => pressed && styles.pressed}>
              <Text style={styles.opsText}>{value}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <NumericLayout values={numeric} setSelectedValue={buttonPressed} />
    </View>
  );
};

const NumericLayout = ({values, setSelectedValue}) => (
  <View style={styles.container}>
    <View style={styles.numericRow}>
      {values.map(value => (
        <Pressable
          key={value + Math.random()}
          onPress={() => setSelectedValue(value)}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Text style={[styles.buttonLabel]}>{value}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

const btnContainerHeight = height / 3;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    position: 'absolute',
    bottom: height / 4,
  },
  numericRow: {
    flex: 1,
    height: height / 12,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  opsContainer: {
    width: width / 1.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    position: 'absolute',
    bottom: btnContainerHeight + 10,
    left: 35,
  },
  opsText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 4,
    height: '100%',
    backgroundColor: '#0075b0ff',
    borderWidth: 0.6,
    borderColor: 'lightgrey',

    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  currencyContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afc9f5',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 25,
    top: width * 0.75,
  },
  currencyText: {
    fontSize: 16,
  },
  resultContainer: {
    width: width,
    alignItems: 'flex-start',

    position: 'absolute',
    top: 100,
    left: 25,
  },
  resultText: {
    fontSize: 22,
  },
  calculatedContainer: {
    alignItems: 'flex-end',

    position: 'absolute',
    bottom: btnContainerHeight + 80,
    right: 30,
  },
  calculatedText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  operationsContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',

    position: 'absolute',
    bottom: btnContainerHeight + 20,
    left: 35,
  },
  pressed: {
    opacity: 0.65,
  },
});

export default Calculator;
