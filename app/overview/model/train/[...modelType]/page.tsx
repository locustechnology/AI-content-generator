import { redirect } from 'next/navigation';

export default function ModelTypePage({ params }: { params: { modeltype?: string[] } }) {
  // Safely access modeltype array with a default empty array
  const [modelType = '', step = 'gender'] = params.modeltype || [];

  if (['female', 'male', 'kids'].includes(modelType)) {
    redirect(`/overview/models/train?step=${step}&model=${modelType}`);
  } else {
    redirect('/overview/models/train?step=gender');
  }

  // This return is unreachable due to redirects, but included for completeness
  return null;
}