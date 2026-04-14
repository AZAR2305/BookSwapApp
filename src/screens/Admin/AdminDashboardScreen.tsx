import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useAuthStore } from '@/src/store/authStore';
import type { BookListing, UserProfile } from '@/src/utils/types';
import {
  blockUser,
  setBookReportStatus,
  subscribeToAllUsers,
  subscribeToReportedBooks,
  unBlockUser,
} from '@/src/services/adminService';
import { deleteBookListing } from '@/src/services/bookService';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function AdminDashboardScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const profile = useAuthStore((state) => state.profile);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reportedBooks, setReportedBooks] = useState<BookListing[]>([]);

  useEffect(() => {
    const unSubUsers = subscribeToAllUsers(setUsers);
    const unSubBooks = subscribeToReportedBooks(setReportedBooks);
    return () => {
      unSubUsers();
      unSubBooks();
    };
  }, []);

  if (profile?.role !== 'admin') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>You do not have admin access.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={{ color: colors.text }}>Admin Dashboard</Text>

      <Text variant="titleMedium" style={{ color: colors.text }}>Users</Text>
      {users.map((user) => (
        <Card key={user.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Card.Title title={user.displayName} subtitle={`${user.email} (${user.role})`} />
          <Card.Actions>
            <Button onPress={() => blockUser(user.id)}>Block</Button>
            <Button onPress={() => unBlockUser(user.id)}>Unblock</Button>
          </Card.Actions>
        </Card>
      ))}

      <Text variant="titleMedium" style={{ color: colors.text }}>Reported Content</Text>
      {reportedBooks.map((book) => (
        <Card key={book.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Card.Title title={book.title} subtitle={`by ${book.author}`} />
          <Card.Actions>
            <Button onPress={() => setBookReportStatus(book.id, false)}>Dismiss Report</Button>
            <Button onPress={() => deleteBookListing(book.id)}>Delete Listing</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  card: {
    borderWidth: 1,
  },
});
