import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STUDENT_ID = 'STU-2026-001';
const GENDERS = ['Male', 'Female', 'Other'];
const COURSES = ['Mobile Dev', 'Web Dev', 'Databases', 'Networking'];
const LEVELS = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
const PRIMARY = '#3c87f7';

function formatDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseDate(text: string) {
  const [year, month, day] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function FormScreen() {
  const theme = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [level, setLevel] = useState(LEVELS[0]);
  const [courses, setCourses] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [subscribe, setSubscribe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleCourse(course: string) {
    setCourses((current) =>
      current.includes(course) ? current.filter((c) => c !== course) : [...current, course]
    );
  }

  function handleDatePicked(date: Date) {
    setBirthDate(formatDate(date));
    if (Platform.OS === 'android') setShowDatePicker(false);
  }

  function handleSubmit() {
    if (fullName.trim() === '') {
      setError('Please enter your full name.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the terms to continue.');
      return;
    }
    setError('');
    Keyboard.dismiss();

    const formData = {
      studentId: STUDENT_ID,
      fullName,
      email,
      phone,
      age: age === '' ? null : Number(age),
      website,
      password,
      bio,
      birthDate: birthDate === '' ? null : birthDate,
      gender,
      level,
      courses,
      hoursPerWeek,
      subscribe,
      agreeTerms,
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    setTimeout(() => {
      console.log(JSON.stringify(formData, null, 2));
      setSubmitting(false);
    }, 1000);
  }

  function handleReset() {
    setFullName('');
    setEmail('');
    setPhone('');
    setAge('');
    setWebsite('');
    setPassword('');
    setBio('');
    setBirthDate('');
    setGender('');
    setLevel(LEVELS[0]);
    setCourses([]);
    setHoursPerWeek(10);
    setSubscribe(false);
    setAgreeTerms(false);
    setError('');
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];
  const boxStyle = [
    styles.box,
    { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} />
            <ThemedText type="subtitle" style={styles.center}>
              Student Sign-up
            </ThemedText>

            <ThemedText type="smallBold">Student ID (read-only)</ThemedText>
            <TextInput
              style={[inputStyle, styles.readOnly]}
              value={STUDENT_ID}
              editable={false}
            />

            <ThemedText type="smallBold">Full name *</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="e.g. Jane Doe"
              placeholderTextColor={theme.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

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

            <ThemedText type="smallBold">Phone</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="+250 7XX XXX XXX"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

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

            <ThemedText type="smallBold">Website</ThemedText>
            <TextInput
              style={inputStyle}
              placeholder="https://..."
              placeholderTextColor={theme.textSecondary}
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemedText type="smallBold">Password</ThemedText>
            <View style={styles.inlineRow}>
              <TextInput
                style={[inputStyle, styles.flex, styles.noMargin]}
                placeholder="At least 6 characters"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={[styles.smallButton, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="small">{showPassword ? 'Hide' : 'Show'}</ThemedText>
              </TouchableOpacity>
            </View>

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

            <ThemedText type="smallBold">Date of birth</ThemedText>
            {Platform.OS === 'web' ? (
              <TextInput
                style={inputStyle}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                value={birthDate}
                onChangeText={setBirthDate}
                maxLength={10}
              />
            ) : (
              <>
                <TouchableHighlight
                  onPress={() => setShowDatePicker(!showDatePicker)}
                  underlayColor={theme.backgroundSelected}
                  style={boxStyle}>
                  <ThemedText>{birthDate === '' ? 'Pick a date 📅' : birthDate}</ThemedText>
                </TouchableHighlight>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate === '' ? new Date(2005, 0, 1) : parseDate(birthDate)}
                    mode="date"
                    maximumDate={new Date()}
                    onValueChange={(_event, date) => handleDatePicked(date)}
                    onDismiss={() => setShowDatePicker(false)}
                  />
                )}
              </>
            )}

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

            <ThemedText type="smallBold">Level of study</ThemedText>
            <View style={[boxStyle, styles.pickerBox]}>
              <Picker
                selectedValue={level}
                onValueChange={(value) => setLevel(value)}
                style={[styles.picker, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                dropdownIconColor={theme.text}>
                {LEVELS.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <ThemedText type="smallBold">Courses of interest</ThemedText>
            <FlatList
              data={COURSES}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable onPress={() => toggleCourse(item)} style={[boxStyle, styles.courseItem]}>
                  <Checkbox
                    value={courses.includes(item)}
                    onValueChange={() => toggleCourse(item)}
                    color={courses.includes(item) ? PRIMARY : undefined}
                  />
                  <ThemedText type="small">{item}</ThemedText>
                </Pressable>
              )}
            />

            <ThemedText type="smallBold">Study hours per week: {hoursPerWeek}</ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={40}
              step={1}
              value={hoursPerWeek}
              onValueChange={setHoursPerWeek}
              minimumTrackTintColor={PRIMARY}
              maximumTrackTintColor={theme.backgroundSelected}
              thumbTintColor={PRIMARY}
            />

            <View style={styles.switchRow}>
              <ThemedText type="smallBold">Subscribe to newsletter</ThemedText>
              <Switch
                value={subscribe}
                onValueChange={setSubscribe}
                trackColor={{ true: PRIMARY }}
              />
            </View>

            <Pressable style={styles.inlineRow} onPress={() => setAgreeTerms(!agreeTerms)}>
              <Checkbox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? PRIMARY : undefined}
              />
              <ThemedText type="small">I agree to the terms and conditions *</ThemedText>
            </Pressable>

            {error !== '' && <ThemedText style={styles.error}>{error}</ThemedText>}

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [styles.button, styles.submit, pressed && styles.pressed]}>
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>Submit</ThemedText>
              )}
            </Pressable>

            <Button title="Reset" onPress={handleReset} color="#888888" />
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
  center: {
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    marginBottom: Spacing.two,
  },
  readOnly: {
    opacity: 0.6,
  },
  noMargin: {
    marginBottom: 0,
  },
  textArea: {
    minHeight: 100,
  },
  box: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pickerBox: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  picker: {
    borderWidth: 0,
    padding: Spacing.two,
    fontSize: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  smallButton: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
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
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.two,
  },
  error: {
    color: '#e5484d',
  },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  submit: {
    backgroundColor: PRIMARY,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
