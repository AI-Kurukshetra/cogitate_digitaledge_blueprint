"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
  section: { marginBottom: 16 },
  label: { fontSize: 9, color: "#666", marginBottom: 2 },
  value: { fontSize: 11 },
  row: { flexDirection: "row", marginBottom: 8 },
  col: { flex: 1 },
});

export type PolicySummaryData = {
  policy_number: string;
  line_of_business: string;
  status: string;
  effective_date: string;
  expiry_date: string;
  annual_premium: string;
  product_name?: string;
  policyholder_name?: string;
  policyholder_address?: string;
};

export function PolicySummaryDocument({ data }: { data: PolicySummaryData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Policy Summary</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Policy number</Text>
          <Text style={styles.value}>{data.policy_number}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Product / Line</Text>
          <Text style={styles.value}>
            {data.product_name || data.line_of_business}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{data.status}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Effective date</Text>
            <Text style={styles.value}>{data.effective_date}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Expiry date</Text>
            <Text style={styles.value}>{data.expiry_date}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Annual premium</Text>
          <Text style={styles.value}>{data.annual_premium}</Text>
        </View>
        {data.policyholder_name ? (
          <View style={styles.section}>
            <Text style={styles.label}>Named insured</Text>
            <Text style={styles.value}>{data.policyholder_name}</Text>
            {data.policyholder_address ? (
              <Text style={[styles.value, { marginTop: 4, color: "#444" }]}>
                {data.policyholder_address}
              </Text>
            ) : null}
          </View>
        ) : null}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>
            This is a computer-generated summary. For full terms see your policy
            documents.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
