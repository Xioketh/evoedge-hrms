import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { JobOffer } from "@prisma/client";

// Replicating EvoEdge HRMS Theme
const theme = {
  primary: "#155DFC",
  foreground: "#00133E",
  text: "#334155",
  muted: "#64748B",
  border: "#E2E8F0",
  bgLight: "#F8FAFC",
};

const styles = StyleSheet.create({
  page: { 
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: theme.primary,
  },
  headerContainer: {
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 26,
    color: theme.foreground,
    fontWeight: "bold",
    marginBottom: 6,
  },
  documentTitle: {
    fontSize: 10,
    color: theme.primary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: theme.bgLight,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    padding: 20,
    marginBottom: 30,
  },
  infoCol: {
    width: "50%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: theme.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    color: theme.foreground,
    fontWeight: "bold",
  },
  bodySection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: theme.foreground,
    fontWeight: "bold",
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 11,
    color: theme.text,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  highlight: {
    fontWeight: "bold",
    color: theme.foreground,
  },
  signatureContainer: {
    marginTop: 40,
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: theme.foreground,
    marginTop: 50,
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 12,
    color: theme.foreground,
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 10,
    color: theme.muted,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: theme.muted,
  }
});

export const OfferLetterTemplate = ({ offer, companyName }: { offer: JobOffer, companyName: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.documentTitle}>Official Employment Offer</Text>
      </View>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Candidate Name</Text>
          <Text style={styles.infoValue}>{offer.firstName} {offer.lastName}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>National Identity Number</Text>
          <Text style={styles.infoValue}>{offer.nicNumber}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Position</Text>
          <Text style={styles.infoValue}>{offer.jobPosition}</Text>
        </View>
      </View>

      <View style={styles.bodySection}>
        <Text style={styles.greeting}>Dear {offer.firstName},</Text>
        <Text style={styles.paragraph}>
          We are pleased to formally offer you the position of <Text style={styles.highlight}>{offer.jobPosition}</Text> ({offer.employmentType.replace('_', ' ')}) at <Text style={styles.highlight}>{companyName}</Text>. 
          We were highly impressed with your skills and experience, and we are confident that you will be a valuable addition to our team.
        </Text>
        <Text style={styles.paragraph}>
          Your anticipated start date will be <Text style={styles.highlight}>{new Date(offer.targetStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>, and your starting base salary will be <Text style={styles.highlight}>{Number(offer.baseSalary).toLocaleString()} per month</Text>.
        </Text>
        {offer.offerContent && (
          <Text style={styles.paragraph}>{offer.offerContent}</Text>
        )}
        <Text style={styles.paragraph}>
          We look forward to welcoming you aboard and achieving great things together.
        </Text>
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureName}>Authorized Signatory</Text>
        <Text style={styles.signatureTitle}>{companyName}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>This is an electronically generated document. Please retain for your records.</Text>
      </View>
    </Page>
  </Document>
);