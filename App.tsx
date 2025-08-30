import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');

  const handleSave = async () => {
    if (!mobile || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all required fields (Mobile, First Name, Last Name)');
      return;
    }

    try {
      const contact = {
        mobile: mobile,
        first_name: firstName,
        last_name: lastName,
        company: company || ''
      };

      const contactJson = JSON.stringify(contact);
      console.log('Sending contact data:', contactJson);
      
      console.log('Making API request to:', "https://511dafc932fa.ngrok-free.app/ReactApp/SaveContact");
      console.log('Request headers:', {
        "Content-Type": "application/json",
      });
      console.log('Request body:', contactJson);
      
      const response = await fetch("https://511dafc932fa.ngrok-free.app/ReactApp/SaveContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: contactJson,
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        // Try to parse as JSON, but fallback to text if it fails
        let result;
        const responseText = await response.text();
        console.log('Raw API Response:', responseText);
        
        try {
          result = JSON.parse(responseText);
          console.log('Parsed API Response:', result);
        } catch (parseError) {
          console.log('Response is not JSON, treating as text');
          result = responseText;
        }
        
        Alert.alert(
          'Success',
          `Contact saved successfully!\n\nName: ${firstName} ${lastName}\nMobile: ${mobile}\nCompany: ${company || 'Not specified'}`,
          [{
            text: 'OK', onPress: () => {
              setMobile('');
              setFirstName('');
              setLastName('');
              setCompany('');
            }
          }]
        );
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        Alert.alert('Error', `Failed to save contact. Status: ${response.status}\n${errorText}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', `Network error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your internet connection and try again.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact Book</Text>
          <Text style={styles.subtitle}>Create a new contact</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              placeholderTextColor="#A0A0A0"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              placeholderTextColor="#A0A0A0"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor="#A0A0A0"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              placeholderTextColor="#A0A0A0"
              value={company}
              onChangeText={setCompany}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    height: 52,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
