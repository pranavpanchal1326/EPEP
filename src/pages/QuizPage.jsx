import { useSEO } from '../hooks/useSEO';
import QuizMode from '../components/Quiz/QuizMode';
const QuizPage = () => {
  useSEO({ title: 'Election Knowledge Quiz — Test Yourself | EPEP', description: '20 questions about Indian elections, ECI, and voting rights.' });
  return (
    <QuizMode />
  )
}

export default QuizPage
