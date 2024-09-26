import React, { useState, useCallback, useMemo } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFemale, FaImages, FaMale, FaRainbow, FaArrowLeft, FaTrash, FaChevronUp, FaChevronDown } from "react-icons/fa";
import * as z from "zod";
import { fileUploadFormSchema } from "@/app/types/zod"; 
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_UPLOAD_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB) || 4.5;
const MAX_FILES = Number(process.env.NEXT_PUBLIC_MAX_FILES) || 10;
const MIN_PHOTOS = Number(process.env.NEXT_PUBLIC_MIN_PHOTOS) || 5;

type FormInput = z.infer<typeof fileUploadFormSchema>;

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

interface Requirement {
  text: string;
  img: string;
}

export default function TrainModelZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isRestrictionsOpen, setIsRestrictionsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      type: "man",
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter(
        (file: File) => !files.some((f) => f.name === file.name)
      ) || [];

      if (newFiles.length + files.length > MAX_FILES) {
        toast({
          title: "Too many images",
          description: `You can only upload up to ${MAX_FILES} images in total. Please try again.`,
          duration: 5000,
        });
        return;
      }

      if (newFiles.length !== acceptedFiles.length) {
        toast({
          title: "Duplicate file names",
          description: "Some of the files you selected were already added. They were ignored.",
          duration: 5000,
        });
      }

      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);
      // Check if total size of existing and new files exceeds the maximum upload size

      if (totalSize + newSize > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Images exceed size limit",
          description: `The total combined size of the images cannot exceed ${MAX_UPLOAD_SIZE_MB}MB.`,
          duration: 5000,
        });
        return;
      }

      setFiles([...files, ...newFiles]);
      toast({
        title: "Images selected",
        description: "The images were successfully selected.",
        duration: 5000,
      });
    },
    [files, toast]
  );

  const removeFile = useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files]
  );

  const trainModel = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const blobUrls = [];
    try {
      if (files.length < MIN_PHOTOS) {
        throw new Error(`Please upload at least ${MIN_PHOTOS} photos before continuing.`);
      }

      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/astria/train-model/image-upload",
        });
        blobUrls.push(blob.url);
      }

      const payload = {
        urls: blobUrls,
        name: form.getValues("name").trim(),
        type: form.getValues("type"),
      };

      const response = await fetch("/astria/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'An error occurred while training the model');
      }

      toast({
        title: "Model queued for training",
        description: "The model was queued for training. You will receive an email when the model is ready to use.",
        duration: 5000,
      });
      router.push("/");
    } catch (error) {
      console.error("Train model error:", error);
      let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (errorMessage.includes("credit")) {
        const messageWithButton = (
          <div className="flex flex-col gap-4">
            {errorMessage}
            <a href="/get-credits">
              <Button size="sm">Get Credits</Button>
            </a>
          </div>
        );
        toast({
          title: "Not enough credits",
          description: messageWithButton,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          duration: 5000,
        });
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [files, form, router, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const requirements: Requirement[] = useMemo(() => [
    { text: "Variety: Upload photos with different outfits and backgrounds.", img: "/images/happy.jpg" },
    { text: "Recency: Use recent photos that reflect your current appearance.", img: "/images/self.jpg" },
    { text: "Clarity: Ensure uploads are well-lit, and you're not too far from the camera.", img: "/images/clear.jpg" },
    { text: "Eye Contact: Uploads should show you looking directly at the camera.", img: "/images/pose.jpg" },
  ], []);

  const restrictions: Requirement[] = useMemo(() => [
    { text: "No Accessories: Avoid photos in hats, sunglasses, and headwear.", img: "/images/girl.jpg" },
    { text: "No Revealing Clothing: No tank tops, bikinis, or shirtless photos.", img: "/images/group.jpg" },
    { text: "No Goofy Faces: Exclude silly expressions like duck faces or extreme poses.", img: "/images/half.jpg" },
    { text: "No Unnatural Angles: Use front-view, eye-level shots; avoid side or extreme angles.", img: "/images/heros.jpg" },
  ], []);


  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/overview" className="text-sm w-fit mb-8 block">
          <Button variant="outline">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/5">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
              <span className="text-lg font-bold">?</span>
            </div>
            <h2 className="text-2xl font-bold">Upload photos</h2>
          </div>
          <p className="mb-4">Now the fun begins! Select at least {MIN_PHOTOS} of your best photos. Good photos will result in amazing headshots!</p>
          
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <div className="flex flex-col items-center">
                <FaImages size={32} className="text-gray-700 mb-2" />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 4.5MB total</p>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">It can take up to 1 minute to upload</p>
        </div>
        
        <div className="w-full md:w-3/5">
          <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span>Progress</span>
              <span>{files.length} / {MAX_FILES}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${(files.length / MAX_FILES) * 100}%`}}></div>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Uploaded photos</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-white text-purple-500 rounded-full p-1 hover:bg-red-100"
                      aria-label="Remove photo"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <RequirementSection
            title="PHOTO REQUIREMENTS"
            items={requirements}
            isOpen={isRequirementsOpen}
            setIsOpen={setIsRequirementsOpen}
            variant="purple"
          />
          
          <RequirementSection
            title="PHOTO RESTRICTIONS"
            items={restrictions}
            isOpen={isRestrictionsOpen}
            setIsOpen={setIsRestrictionsOpen}
            variant="red"
          />

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 flex justify-start">
            <Button
              onClick={trainModel}
              className="bg-purple-500 text-white font-bold py-2 px-3 rounded-md text-sm transition duration-300 hover:bg-purple-600"
              disabled={isLoading || files.length < MIN_PHOTOS}
            >
              {isLoading ? 'Processing...' : 'Train Model'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RequirementSectionProps {
  title: string;
  items: Requirement[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant: 'purple' | 'red';
}

const RequirementSection: React.FC<RequirementSectionProps> = ({ title, items, isOpen, setIsOpen, variant }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <h4 className={`text-lg font-semibold text-${variant}-500`}>{title}</h4>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </div>
    {isOpen && (
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Image src={item.img} alt={item.text} width={50} height={50} className="rounded-lg" />
            <p className="text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);