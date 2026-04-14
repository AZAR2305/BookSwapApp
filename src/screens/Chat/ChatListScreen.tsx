import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Text } from 'react-native-paper';
import { subscribeToThreads } from '@/src/services/chatService';
import { useAuthStore } from '@/src/store/authStore';
import type { ChatThread } from '@/src/utils/types';
import type { RootStackParamList } from '@/src/navigation/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function ChatListScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    if (!user) return;
    return subscribeToThreads(user.uid, setThreads);
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineSmall" style={{ color: colors.text, marginBottom: 10 }}>Messages</Text>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { threadId: item.id })}>
            <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Card.Title title={item.bookId} subtitle={item.lastMessage || 'No messages yet'} />
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No chats yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
  },
});
