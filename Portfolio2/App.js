import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput } from 'react-native';
import { Button, Card, CheckBox } from 'react-native-elements';


let questions = [
  {
    title: "UCF Colors",
    multipleAnswers: true,
    answers: [
      { correct: false, title: "Green" },
      { correct: true, title: "Gold" },
      { correct: false, title: "Orange" },
      { correct: true, title: "Black" },
    ]
  },

  {
    title: "UCF Mascots",
    multipleAnswers: true,
    answers: [
      { correct: true, title: "Knightro" },
      { correct: false, title: "Gator" },
      { correct: false, title: "Bull" },
      { correct: true, title: "Pegasus" },
    ]
  },
  
]



const Stack = createNativeStackNavigator();

function writtenResponseScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <WrittenR></WrittenR>
      <StatusBar style="auto" />
    </View>
  )
}

function multipleChoiceScreen({ navigation }) {
  let [score, setScore] = useState()
  let [answers, setAnswers] = useState([])
  let checkAnswers = useCallback((data, qAnswers) => {
    let answersCorrect = true

    for (let i = 0; i < data.answers.length; i++) {
      let qCorrect
      if (data.answers[i].correct) {
        qCorrect = qAnswers.includes(i)
      } else {
        qCorrect = !qAnswers.includes(i)
      }
      answersCorrect = answersCorrect && qCorrect
    }

    if (answersCorrect) {
      setScore(prevScore => {
        if (prevScore !== undefined) {
          return prevScore + 1
        } else {
          return 1
        }
      })
    } else {
      setScore(prevScore => prevScore === undefined ? 0 : prevScore)
    }
  }, [answers, score,])
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Quiz Application</Text>
      <FlatList data={questions} renderItem={({ item, index }) =>
        <Question showAnswers={score !== undefined} data={item} key={index}
          setAnswers={
            (answers) => {
              setAnswers(prev => {
                prev[index] = answers
                return [...prev]
              })
            }}
          answers={answers[index]}
        ></Question>
      }></FlatList>

      <Button title='Submit' onPress={
        () => questions.forEach((q, i) => checkAnswers(q, answers[i]))}
        disabled={answers.length == 0}></Button>
      {score !== undefined ? <Text>Score:{score} </Text> : undefined}
      <StatusBar style="auto" />
    </View>
  )
}

function fillintheBlankScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>fill in the blank</Text>
      <StatusBar style="auto" />
    </View>
  )
}

function HomeScreen({ navigation }) {
  let gotoPage2 = useCallback(() => {
    navigation.navigate("Written Response")
  })
  let gotoPage3 = useCallback(() => {
    navigation.navigate("Multiple Choice")
  })
  let gotoPage4 = useCallback(() => {
    navigation.navigate("Fill in the Blank")
  })
  return (
    <View style={styles.container}>
    <Text style={styles.text}>UCF Trivia</Text>
    <Button onPress={gotoPage2} title="Written Response"></Button>
    <Button onPress={gotoPage3} title="Multiple Choice"></Button>
    <Button onPress={gotoPage4} title="Fill in the Blank"></Button>
    <StatusBar style="auto" />
    </View>
      )
}

export default function App() {
  return <>
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Written Response" component={writtenResponseScreen} />
        <Stack.Screen name="Multiple Choice" component={multipleChoiceScreen} />
        <Stack.Screen name="Fill in the Blank" component={fillintheBlankScreen} />
      </Stack.Navigator>
  </NavigationContainer>
  </>
}



function WrittenR () {
  let simplerVar = "What year was UCF founded"
  let [applicationState, setApplicationState] = useState(false)
  let [textValue, setTextValue] = useState("")
 
  let pressButton = useCallback(() => {
    if (textValue === "1963") {
      setApplicationState(true)

    } else {

    }
    
  }, [textValue])

  return (
    applicationState ? 
  <View style={styles.container2}>
    <Text style={styles.text}>correct</Text>
  </View>
  :
    <View style={styles.container2}>
      <View>
        <Text style={styles.text} >{simplerVar}</Text>
      </View>

      <TextInput
      style={styles.input} value={textValue} onChangeText={setTextValue} placeholder="0000">
      </TextInput>
      
      <Button title='Submit' onPress={pressButton} ></Button>
    </View>
  );
}



function Question({ data, answers, showAnswers, setAnswers }) {
  let selectAnswer = useCallback((index) => {
    if (answers === undefined) {
      answers = []
    }
    if (!answers.includes(index)) {
      answers.push(index)
      setAnswers([...answers])
    } else {
      answers = answers.filter(i => i !== index)
      setAnswers([...answers])
    }
  }, [answers])
  return (
    <>
      <Card>
        <Card.Title>{data.title} </Card.Title>
        <View>
          {data.answers.map(
            (answer, index) =>
              <CheckBox key={index}
                textStyle={showAnswers && !answer.correct ? styles.inccorect : undefined}
                checked={answers ? answers.includes(index) : false}
                onIconPress={() => selectAnswer(index)}
                onPress={() => selectAnswer(index)}
                title={answer.title}></CheckBox>
          )}
        </View>
      </Card>
    </>
  );
}



const styles = StyleSheet.create({
  inccorect: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "red"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container2: {
    flex: 1,
    flexDirection: "column",
    height: 100,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginVertical: "1em",
      textAlign: "center"
   },

});
