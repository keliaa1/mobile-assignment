import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const GENDERS = ['Male', 'Female', 'Other'];
const COURSES = ['Mobile Dev', 'Web Dev', 'Databases', 'Networking'];

export default function FormScreen() {
  const theme = useTheme();

  // One piece of state per form field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [subscribe, setSubscribe] = useState(false);

  // Checkbox-style toggle: add the course if missing, remove it if present
  function toggleCourse(course: string) {
    setCourses((current) =>
      current.includes(course) ? current.filter((c) => c !== course) : [...current, course]
    );
  }

  function handleSubmit() {
    const formData = {
      fullName,
      email,
      phone,
      age: age === '' ? null : Number(age),
      password,
      bio,
      gender,
      courses,
      subscribe,
      submittedAt: new Date().toISOString(),
    };

    console.log(JSON.stringify(formData, null, 2));
  }

  function handleReset() {
    setFullName('');
    setEmail('');
    setPhone('');
    setAge('');
    setPassword('');
    setBio('');
    setGender('');
    setCourses([]);
    setSubscribe(false);
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <ThemedText type="subtitle">Student Sign-up</ThemedText>

            {/* 1. Plain text */}
            <ThemedText type="smallBold">Full name</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="e.g. Jane Doe"
              placeholderTextColor={theme.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            {/* 2. Email */}
            <ThemedText type="smallBold">Email</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="you@example.com"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* 3. Phone */}
            <ThemedText type="smallBold">Phone</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="+250 7XX XXX XXX"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {/* 4. Number */}
            <ThemedText type="smallBold">Age</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="e.g. 21"
              placeholderTextColor={theme.textSecondary}
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={3}
            />

            {/* 5. Password */}
            <ThemedText type="smallBold">Password</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* 6. Multiline (textarea) */}
            <ThemedText type="smallBold">Short bio</ThemedText>
            <TextInput
              style={[inputStyle, styles.textArea]}
              placeholder="Tell us about yourself..."
              placeholderTextColor={theme.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Radio group: only one option can be selected */}
            <ThemedText type="smallBold">Gender</ThemedText>
            <View style={styles.row}>
              {GENDERS.map((option) => {
                const selected = gender === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setGender(option)}
                    style={[
                      styles.chip,
                      { borderColor: theme.backgroundSelected },
                      selected && styles.chipSelected,
                    ]}>
                    <ThemedText type="small" style={selected && styles.chipTextSelected}>
                      {selected ? '◉ ' : '○ '}
                      {option}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {/* Checkbox group: many options can be selected */}
            <ThemedText type="smallBold">Courses of interest</ThemedText>
            <View style={styles.row}>
              {COURSES.map((course) => {
                const checked = courses.includes(course);
                return (
                  <Pressable
                    key={course}
                    onPress={() => toggleCourse(course)}
                    style={[
                      styles.chip,
                      { borderColor: theme.backgroundSelected },
                      checked && styles.chipSelected,
                    ]}>
                    <ThemedText type="small" style={checked && styles.chipTextSelected}>
                      {checked ? '☑ ' : '☐ '}
                      {course}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {/* Switch: an on/off value */}
            <View style={styles.switchRow}>
              <ThemedText type="smallBold">Subscribe to newsletter</ThemedText>
              <Switch value={subscribe} onValueChange={setSubscribe} />
            </View>

            {/* Buttons */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.button, styles.submit, pressed && styles.pressed]}>
              <ThemedText style={styles.buttonText}>Submit</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}>
              <ThemedText>Reset</ThemedText>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    marginBottom: Spacing.two,
  },
  textArea: {
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  chipSelected: {
    backgroundColor: '#3c87f7',
    borderColor: '#3c87f7',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  submit: {
    backgroundColor: '#3c87f7',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
