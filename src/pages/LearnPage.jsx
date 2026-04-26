import { useSEO } from '../hooks/useSEO';
import EducationHub from '../components/Education/EducationHub';
const LearnPage = () => {
  useSEO({ title: 'How Indian Elections Work — Guide | EPEP', description: 'Complete guide to India\'s election process from registration to results.' });
  return (
    <EducationHub />
  )
}

export default LearnPage
