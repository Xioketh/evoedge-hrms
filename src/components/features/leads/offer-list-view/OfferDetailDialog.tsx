"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Text } from "@/src/components/ui/text";
import { SafeJobOffer } from "@/src/types/offer.types";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { formatDate, formatEmploymentType } from "@/src/lib/formatters";

interface OfferDetailDialogProps {
  offer: SafeJobOffer;
  children: React.ReactNode;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text size="1" color="muted" className="uppercase tracking-wider">
        {label}
      </Text>
      <div>{children}</div>
    </div>
  );
}

export function OfferDetailDialog({
  offer,
  children,
}: OfferDetailDialogProps) {
  const fullName = `${offer.firstName} ${offer.lastName}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Offer Details</DialogTitle>
          <Text size="1" color="muted">
            Offer for {fullName}
          </Text>
        </DialogHeader>

        {/* Candidate Information */}
        <div className="space-y-4">
          <Text size="2" className="font-semibold">
            Candidate Information
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <DetailRow label="Full Name">
              <Text size="2">{fullName}</Text>
            </DetailRow>
            <DetailRow label="NIC Number">
              <Text size="2">{offer.nicNumber}</Text>
            </DetailRow>
            <DetailRow label="Email">
              <Text size="2" className="break-all">
                {offer.email}
              </Text>
            </DetailRow>
            <DetailRow label="Status">
              <OfferStatusBadge status={offer.status} />
            </DetailRow>
          </div>
        </div>

        <hr className="border-border" />

        {/* Position Details */}
        <div className="space-y-4">
          <Text size="2" className="font-semibold">
            Position Details
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <DetailRow label="Job Position">
              <Text size="2">{offer.jobPosition}</Text>
            </DetailRow>
            <DetailRow label="Employment Type">
              <Text size="2">
                {formatEmploymentType(offer.employmentType)}
              </Text>
            </DetailRow>
            <DetailRow label="Base Salary">
              <Text size="2" className="font-medium">
                {Number(offer.baseSalary).toLocaleString("en-US", {
                  style: "currency",
                  currency: "LKR",
                  minimumFractionDigits: 2,
                })}
              </Text>
            </DetailRow>
            <DetailRow label="Target Start Date">
              <Text size="2">{formatDate(offer.targetStartDate)}</Text>
            </DetailRow>
          </div>
        </div>

        <hr className="border-border" />

        {/* Timeline */}
        <div className="space-y-4">
          <Text size="2" className="font-semibold">
            Timeline
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <DetailRow label="Sent Date">
              <Text size="2">{formatDate(offer.createdAt)}</Text>
            </DetailRow>
            <DetailRow label="Responded At">
              <Text size="2">
                {offer.respondedAt ? formatDate(offer.respondedAt) : "—"}
              </Text>
            </DetailRow>
            <DetailRow label="Completed At">
              <Text size="2">
                {offer.completedAt ? formatDate(offer.completedAt) : "—"}
              </Text>
            </DetailRow>
          </div>
        </div>

        {/* Offer Content */}
        {offer.offerContent && (
          <>
            <hr className="border-border" />
            <div className="space-y-2">
              <Text size="2" className="font-semibold">
                Offer Message
              </Text>
              <div className="rounded-lg bg-muted/50 p-3">
                <Text size="1" color="muted" className="whitespace-pre-wrap">
                  {offer.offerContent}
                </Text>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
