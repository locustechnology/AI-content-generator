import TrainFlowComponent from '@/components/TrainFlowComponent';

export default function TrainPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div id="train-model-container" className="flex flex-1 flex-col gap-6">
        <TrainFlowComponent />
      </div>
    </div>
  );
}