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
function RepetitionExerciseScreen({ route, navigation }) {
  let { exerciseList, exerciseKey } = route.params
  let gotoExercise = useCallback(() => {
    navigation.push("RepetitionExercise", { exerciseKey: "2", exerciseList: exerciseList, count: route.params.count + 1 })
  })
  let currentExercise = exerciseList.find(ex => ex.key === exerciseKey)

  return (
    <View style={styles.container}>
      <Text>{currentExercise.name} : {route.params.count} </Text>
      <Button onPress={gotoExercise} title='New Screen'></Button>
      <Button onPress={() => navigation.navigate("Home")} title='Home'></Button>
      <StatusBar style="auto" />
    </View>
  )
}



function HomeScreen({ navigation }) {
  let exerciseList = [
    {
      name: "Ex1",
      key: "1"
    },
    {
      name: "Ex2",
      key: "2"
    },
  ]
  let gotoExercise = useCallback(({ key }) => {
    navigation.navigate("RepetitionExercise", { exerciseKey: key, count: 0, exerciseList: exerciseList })
  })
  return (
    <View style={styles.container}>
      <FlatList data={exerciseList} renderItem={({ item }) =>
        <Button onPress={() => gotoExercise(item)} title={item.name}></Button>
      } />
      <StatusBar style="auto" />
    </View>
  )
}

export default function App() {
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
  return <>
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RepetitionExercise" component={RepetitionExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>

    <View style={styles.container}>
      <Text>Quiz Application</Text>
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
  </>
}



function WrittenR () {
  let simplerVar = "What year was UCF founded"
  let [applicationState, setApplicationState] = useState(false)
  let [textValue, setTextValue] = useState("")
 
  let pressButton = useCallback(() => {
    

    if (textValue === "1963") {
      setApplicationState(true)
      setError("")
    } else {
      setError()
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

      <Button title='1963' onPress={pressButton} ></Button>

    </View>

  );
}



function Question({ data, answers, showAnswers, setAnswers }) {
  let selectAnswer = useCallback((index) => {
    console.log("onPress()", index, answers);
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
