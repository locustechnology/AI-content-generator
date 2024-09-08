import Image from 'next/image';
import Group from "/public/Group.png";
import exampl from "/public/exampl.png";
import resulte from "/public/resulte.png";

export default function ExplainerSection() {
  return (
    <div className="w-full max-w-6xl mt-16 p-8 bg-gray-100 rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>

      {/* Step 1: Upload your images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
            1
          </div>
          <h3 className="text-2xl font-semibold">Upload a few photos</h3>
        </div>
        <p className="text-sm text-gray-600 text-center">
        Upload a few photos of yourself, and we'll take care of the rest.
        </p>
        <Image
          src={resulte}
          alt="AI Headshot example"
          className="rounded-lg object-cover w-full md:w-3/4 lg:w-1/2 mx-auto"
        />
      </div>

      {/* Step 2: Train your model */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
            2
          </div>
          <h3 className="text-2xl font-semibold">Our AI gets to work</h3>
        </div>
        <p className="text-sm text-gray-600 text-center">
        <p className="text-sm text-gray-600 text-center">
        We use cutting-edge technology built by AI researchers <br/>from
        Meta and Microsoft to create your headshots.        </p>
        </p>
        <Image
          src={Group}
          alt="AI Headshot blur"
          className="rounded-lg object-cover w-full md:w-3/4 lg:w-1/2 mx-auto"
        />
      </div>

      {/* Step 3: Generate images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
            3
          </div>
          <h3 className="text-2xl font-semibold">Download favourite Headshots</h3>
        </div>
        <p className="text-sm text-gray-600 text-center">
        You'll receive different backgrounds, poses, and styles to choose<br/>
        the perfect AI headshot. Ready for all use cases, from personal<br/>
        to the most professional.        </p>
        <Image
          src={exampl}
          alt="AI Headshot result"
          className="rounded-lg object-cover w-full md:w-3/4 lg:w-1/2 mx-auto"
        />
      </div>
    </div>
  );
}