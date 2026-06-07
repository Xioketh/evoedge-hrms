// src/app/offer/[token]/page.tsx
import { notFound } from "next/navigation";
import { getPublicOfferDetails } from "@/src/core/services/offer.service";
import OfferViewer from "@/src/components/features/leads/OfferViewer";

interface OfferPageProps {
  params: Promise<{ token: string }>;
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { token } = await params;

  const offer = await getPublicOfferDetails(token);

  if (!offer) {
    notFound(); 
  }
  const serializedOffer = {
    ...offer,
    baseSalary: offer.baseSalary.toNumber(), 
    
  };

  return (
    <main className="flex items-center justify-center mt-5">
      <OfferViewer offer={serializedOffer} />
    </main>
  );
}