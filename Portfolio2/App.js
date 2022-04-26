import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
  }, [answers, score])
  return <>
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
});
