import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { JobOffer } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  section: { marginBottom: 15 },
  text: { fontSize: 12, marginBottom: 8, lineHeight: 1.5 },
  bold: { fontWeight: "bold" }
});

export const OfferLetterTemplate = ({ offer, companyName }: { offer: JobOffer, companyName: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{companyName} - Employment Offer</Text>
      
      <View style={styles.section}>
        <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.text}>Name: {offer.firstName} {offer.lastName}</Text>
        <Text style={styles.text}>NIC: {offer.nicNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Dear {offer.firstName},</Text>
        <Text style={styles.text}>
          We are pleased to offer you the position of <Text style={styles.bold}>{offer.jobPosition}</Text> ({offer.employmentType.replace('_', ' ')}) at {companyName}.
        </Text>
        <Text style={styles.text}>
          Your anticipated start date will be {new Date(offer.targetStartDate).toLocaleDateString()}, and your starting base salary will be {Number(offer.baseSalary).toLocaleString()} per month.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{offer.offerContent}</Text>
      </View>
    </Page>
  </Document>
);