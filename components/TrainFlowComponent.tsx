'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { ModelTypeSelector } from '@/components/ModelTypeSelector';
import BackgroundSelectionPage from '@/components/Baground';
import HairColorPage from '@/components/HairColor';
import EyeColorPage from '@/components/EyeColor';
import TrainModelZone from '@/components/TrainModelZone';
import GetCreditsPage from '@/app/get-credits/page';

const TrainFlowComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get('step') || 'gender';

  const navigateToNextStep = (nextStep: string) => {
    router.push(`/overview/models/train?step=${nextStep}`);
  };

  switch (step) {
    case 'gender':
      return <ModelTypeSelector onSelectModel={() => navigateToNextStep('style')} />;
    case 'style':
      return <BackgroundSelectionPage onContinue={() => navigateToNextStep('eyes-color')} />;
    case 'eyes-color':
      return <EyeColorPage onContinue={() => navigateToNextStep('hair-color')} />;
    case 'hair-color':
      return <HairColorPage onContinue={() => navigateToNextStep('image-upload')} />;
    case 'image-upload':
      return <TrainModelZone onContinue={() => navigateToNextStep('get-credits')} />;
    case 'get-credits':
      return <GetCreditsPage />;
    default:
      return <ModelTypeSelector onSelectModel={() => navigateToNextStep('style')} />;
  }
};

export default TrainFlowComponent;