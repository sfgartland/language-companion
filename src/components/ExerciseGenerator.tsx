// @ts-nocheck


import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Skeleton,
  Switch
} from '@nextui-org/react'
import { Fragment, useState } from 'react'
import { BasicInputArea } from './basic-input-area'

import { GrPowerReset } from 'react-icons/gr'
import { CtrlEnterSymbol } from './action-button'

function ExerciseInput({
  value,
  onChange,
  maxAnsLength,
  showAnswers,
  answer
}: {
  value: string
  onChange: (val: string) => void
  maxAnsLength: number
  showAnswers: boolean
  answer: string
}) {
  const [show, setShow] = useState<boolean>(false)

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    direction: 'down' | 'up'
  ) => {
    console.log(e, direction)
    if (e.key == 'Control' && direction == 'down') setShow(true)
    else if (e.key == 'Control' && direction == 'up') setShow(false)
  }

  return (
    <Input
      value={value}
      label={showAnswers || show ? answer : ' '}
      onChange={e => onChange(e.target.value)}
      className={`mx-2 w-${Math.max(maxAnsLength * 2, 15)}`}
      //   classNames={{input: [`w-${maxAnsLength + 1}`]}}
      size="sm"
      onKeyDown={e => handleKey(e, 'down')}
      onKeyUp={e => handleKey(e, 'up')}
    />
  )
}

export function ExerciseGenerator() {
  const [exercises, setExercises] = useState<
    { question: string; answer: string }[]
  >([])
  const [answerInputs, setAnswerInputs] = useState<{ [index: string]: string }>(
    {}
  )

  const [fetching, setFetching] = useState<boolean>(false)
  const [question, setQuestion] = useState<string>(
    'Exercises to practice adjective declention.'
  )
  const [setLastInputText] = useState<string>()
  const [showAnswers, setShowAnswers] = useState<boolean>(false)
  const [showCorrectStatus, setShowCorrectStatus] = useState<boolean>(false)

  const generateExercises = async () => {
    setFetching(true)
    setLastInputText(question)

    try {
      const res = await fetch('/api/exercises', {
        body: JSON.stringify({ text: question }),
        method: 'POST'
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const ex = (await res.json()).exercises
      console.log(ex)

      const mapped = ex.questions.map((q: string, i: number) => ({
        question: q,
        answer: ex.answers[i]
      }))
      setExercises(mapped)
      setAnswerInputs({})
      setShowAnswers(false)
    } catch (err) {
      alert(err)
    }

    setFetching(false)
  }

  const maxAnsLength = Math.max(...exercises.map(ans => ans.answer.length))
  console.log(maxAnsLength)

  const renderedExercises = exercises.map((ex, i) => {
    const str = ex.question.split('__').map((val, i_split) => {
      if (i_split == 0) return <span key={i}>{val}</span>
      else
        return (
          <Fragment key={i}>
            <ExerciseInput
              key={'a' + i}
              value={answerInputs[i.toString()] || ''}
              showAnswers={showAnswers}
              answer={ex.answer}
              onChange={(val: string) => {
                const newState = { ...answerInputs }
                newState[i.toString()] = val
                setAnswerInputs(newState)
              }}
              maxAnsLength={maxAnsLength}
            />
            <span>{val}</span>
          </Fragment>
        )
    })
    const isCorrect = answerInputs[i.toString()] == ex.answer
    let correctStyle: string
    if (showCorrectStatus) {
      if (isCorrect) correctStyle = 'bg-green-50'
      else correctStyle = 'bg-red-50'
    } else {
      correctStyle = ''
    }

    return (
      <li key={i} className={`flex my-3 ${correctStyle} items-end`}>
        {str}
      </li>
    )
  })

  return (
    <Card className="m-5 p-5">
      <CardHeader>
        <div className="flex flex-col w-full">
          <h2 className="text-xl m-5">Generate Exercises</h2>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col">
        <div className="flex justify-between mb-5">
          <Button
            onClick={() => {
              setExercises([])
              setAnswerInputs({})
            }}
          >
            Reset
          </Button>
          <Button color="primary" variant="ghost" onClick={generateExercises}>
            Generate <CtrlEnterSymbol />
          </Button>
        </div>
        <BasicInputArea
          label="What exercise to generate"
          question={question}
          setQuestion={setQuestion}
          submitAction={generateExercises}
        />
        <Skeleton className="m-5" isLoaded={!fetching}>
          {exercises.length > 0 ? (
            <ul>{renderedExercises}</ul>
          ) : (
            <div className="min-h-[20vh] flex justify-center items-center border rounded-lg">
              <span className="italic">
                Write a prompt and press generate to create a exercise....
              </span>
            </div>
          )}
        </Skeleton>
      </CardBody>
      <CardFooter>
        <div className="flex justify-between w-full sticky">
          <Switch
            isSelected={showCorrectStatus}
            onValueChange={setShowCorrectStatus}
          >
            Show if correct
          </Switch>
          <Button onClick={() => setAnswerInputs({})} isIconOnly>
            <GrPowerReset />
          </Button>
          <Switch isSelected={showAnswers} onValueChange={setShowAnswers}>
            Show all answers
          </Switch>
        </div>
      </CardFooter>
    </Card>
  )
}
