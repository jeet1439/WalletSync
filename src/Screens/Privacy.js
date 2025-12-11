import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

const Privacy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy — WalletSync</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.text}>
          WalletSync is a personal finance tracker that helps users record and monitor
          their transactions. This Privacy Policy explains how your data is collected,
          used, and protected when using the app.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>2. Information We Collect</Text>
        <Text style={styles.subheading}>a) Manually Added Transactions</Text>
        <Text style={styles.text}>
          Users can manually add expenses and transactions. These entries are stored
          securely in local storage or database depending on app settings.
        </Text>

        <Text style={styles.subheading}>b) Notification Access (If Permission Granted)</Text>
        <Text style={styles.text}>
          If the user grants Notification Access, WalletSync reads UPI and bank SMS-like
          notifications to detect transaction amounts, sender/receiver, and timestamps.
          Only payment-related notifications are processed and stored.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>3. How We Use Your Data</Text>
        <Text style={styles.text}>We use your data to:</Text>
        <Text style={styles.list}>• Track and store your expenses</Text>
        <Text style={styles.list}>• Auto-detect UPI transactions (if permission is given)</Text>
        <Text style={styles.list}>• Generate insights to help manage your spending</Text>
        <Text style={styles.text}>
          WalletSync does NOT sell, share, or send your data to third parties.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>4. Notification Permission</Text>
        <Text style={styles.text}>
          Granting Notification Access is optional. If enabled, WalletSync only reads
          payment-related notifications to help auto-add your transactions. You can disable
          this permission anytime from system settings.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>5. Data Storage</Text>
        <Text style={styles.text}>
          All data is stored securely on your device or synced to the app’s database
          depending on configuration. No financial information is shared with external
          servers without your consent.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>6. Your Rights</Text>
        <Text style={styles.list}>• You can view or delete your transaction history anytime.</Text>
        <Text style={styles.list}>• You can revoke notification permissions anytime.</Text>
        <Text style={styles.list}>
          • You may uninstall the app to permanently remove all locally stored data.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>7. Contact Us</Text>
        <Text style={styles.text}>
          If you have any privacy-related questions, you can contact us at:
        </Text>
        <Text style={styles.list}>support@walletsync.app</Text>
      </View>

      <Text style={styles.footer}>Last Updated: {new Date().getFullYear()}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
    paddingHorizontal: 20,
    paddingTop: 40,

  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'rgba(28, 14, 53, 0.85)',
    padding: 18,
    borderRadius: 16,
    marginTop: 25,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subheading: {
    color: '#c7baff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    color: '#dcd6f7',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    color: '#dcd6f7',
    fontSize: 14,
    marginTop: 6,
  },
  footer: {
    textAlign: 'center',
    color: '#9f8fe6',
    marginVertical: 40,
    fontSize: 12,
  },
});

export default Privacy;
