import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, SafeAreaView, Platform } from 'react-native';
import { GlobalStore } from '../GlobalStore';

export default function EditProfileScreen({ navigation, route }) {
  const { profile } = route.params || {};

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      return Alert.alert('Error', 'Name and Email are required.');
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user/profile/${GlobalStore.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, dob })
      });
      const data = await response.json();
      
      setLoading(false);
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to update profile');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Network Error', 'Could not reach backend');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Text style={styles.subtitle}>Update your personal information</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. John Doe" 
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="email-address"
          placeholder="e.g. john@example.com" 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput 
          style={styles.input} 
          placeholder="DD/MM/YYYY" 
          placeholderTextColor="#666"
          value={dob}
          onChangeText={setDob}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Updates'}</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20, alignItems: 'center'}}>
        <Text style={{color: '#888', textDecorationLine: 'underline'}}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 40 },
  card: { backgroundColor: '#1C1F26', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  label: { color: '#AAA', fontSize: 14, marginBottom: 10 },
  input: { backgroundColor: '#0F1115', color: 'white', padding: 15, borderRadius: 10, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#00FFA3', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#0F1115', fontSize: 16, fontWeight: 'bold' }
});
