import {Dimensions, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Button from '../UI/Button';
// import {NoteNavigationType, NoteRouteProp} from '../types';

type Props = {};

type Note = {
  note: string;
  [key: string]: any;
};

const {width, height} = Dimensions.get('window');

const Note = ({setNotePressed, setNote, note}: Props) => {
  // useEffect(() => {
  //   setNote(prev => ({
  //     ...prev,
  //     note: route.params.note as string,
  //   }));
  // }, [route.params]);

  function onSaveHandler() {
    setNotePressed(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.close}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={() => setNotePressed(false)}>
          <Ionicons name="close" size={24} color="black" />
        </Pressable>
      </View>
      <TextInput
        placeholder="Write notes"
        multiline
        value={note.note}
        onChangeText={note => setNote(prev => ({...prev, note: note}))}
        style={{
          width: '95%',
          height: 250,
          margin: 30,
          borderWidth: 1,
        }}
      />
      <Button style={styles.button} onPress={() => onSaveHandler()}>
        Save
      </Button>
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.5,
    position: 'absolute',
    top: 50,
    left: 20,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: 'white',
  },
  close: {
    width: width * 0.9,
    alignItems: 'flex-end',
    marginRight: 20,
    marginTop: 10,
    // backgroundColor: 'red',
  },
  button: {
    width: 100,
    color: 'red',
  },
  pressed: {
    opacity: 0.75,
  },
});
