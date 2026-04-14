import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { sendMessage, subscribeToMessages } from '@/src/services/chatService';
import { useAuthStore } from '@/src/store/authStore';
import type { ChatMessage } from '@/src/utils/types';
import type { RootStackParamList } from '@/src/navigation/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function ChatRoomScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const route = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>();
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    return subscribeToMessages(route.params.threadId, setMessages);
  }, [route.params.threadId]);

  const onSend = async () => {
    if (!text.trim() || !user) return;
    await sendMessage(route.params.threadId, user.uid, text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <View style={[styles.header, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text variant="titleMedium" style={{ color: colors.text }}>{route.params.title || 'Chat'}</Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Talk directly with the seller.</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.bubble,
              { borderColor: colors.border },
              item.senderId === user?.uid
                ? { alignSelf: 'flex-end', backgroundColor: colors.soft }
                : { alignSelf: 'flex-start', backgroundColor: colors.card },
            ]}>
            <Card.Content>
              <Text style={{ color: colors.text }}>{item.text}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <TextInput mode="outlined" style={[styles.input, { backgroundColor: colors.input }]} value={text} onChangeText={setText} placeholder="Type a message" />
        <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={onSend} disabled={!text.trim()}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  list: {
    padding: 12,
  },
  bubble: {
    marginBottom: 8,
    maxWidth: '82%',
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
  },
});
