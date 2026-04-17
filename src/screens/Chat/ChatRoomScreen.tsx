import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { generateBookAssistantReply } from '@/src/services/bookAssistantService';
import { getBookListingById } from '@/src/services/bookService';
import { sendMessage, subscribeToMessages, subscribeToThread } from '@/src/services/chatService';
import { useAuthStore } from '@/src/store/authStore';
import type { BookListing, ChatMessage, ChatThread } from '@/src/utils/types';
import type { RootStackParamList } from '@/src/navigation/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function ChatRoomScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const route = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>();
  const user = useAuthStore((state) => state.user);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [book, setBook] = useState<BookListing | null>(null);
  const [assistantReply, setAssistantReply] = useState('');
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    return subscribeToMessages(route.params.threadId, setMessages);
  }, [route.params.threadId]);

  useEffect(() => subscribeToThread(route.params.threadId, setThread), [route.params.threadId]);

  useEffect(() => {
    const bookId = thread?.bookId ?? route.params.bookId;

    if (!bookId) {
      setBook(null);
      setAssistantReply('');
      setBookLoading(false);
      setAssistantLoading(false);
      return;
    }

    let cancelled = false;
    setAssistantReply('');

    const loadBook = async () => {
      setBookLoading(true);

      try {
        const nextBook = await getBookListingById(bookId);
        if (!cancelled) {
          setBook(nextBook);
        }
      } catch (error) {
        console.warn('Failed to load book for chat assistant:', error);
        if (!cancelled) {
          setBook(null);
        }
      } finally {
        if (!cancelled) {
          setBookLoading(false);
        }
      }
    };

    void loadBook();

    return () => {
      cancelled = true;
    };
  }, [route.params.bookId, thread?.bookId]);

  useEffect(() => {
    if (!book) {
      setAssistantReply('');
      return;
    }

    let cancelled = false;

    const loadAssistantReply = async () => {
      setAssistantLoading(true);

      try {
        const reply = await generateBookAssistantReply(book);
        if (!cancelled) {
          setAssistantReply(reply);
        }
      } finally {
        if (!cancelled) {
          setAssistantLoading(false);
        }
      }
    };

    void loadAssistantReply();

    return () => {
      cancelled = true;
    };
  }, [book]);

  const onSend = async () => {
    if (!text.trim() || !user) return;
    await sendMessage(route.params.threadId, user.uid, text.trim());
    setText('');
  };

  const onAskAssistant = async () => {
    if (!book || !assistantQuestion.trim()) return;

    setAssistantLoading(true);

    try {
      const reply = await generateBookAssistantReply(book, assistantQuestion.trim());
      setAssistantReply(reply);
      setAssistantQuestion('');
    } finally {
      setAssistantLoading(false);
    }
  };

  const headerTitle = book?.title || route.params.title || 'Chat';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <View style={[styles.header, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text variant="titleMedium" style={{ color: colors.text }}>{headerTitle}</Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Talk directly with the seller.</Text>
      </View>

      <Card style={[styles.assistantCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Card.Content style={styles.assistantContent}>
          <View style={styles.assistantHeader}>
            <Text variant="titleSmall" style={{ color: colors.text }}>Book Assistant</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {bookLoading ? 'Loading book details...' : book ? 'Context-aware help for this listing.' : 'No book context found.'}
            </Text>
          </View>

          {assistantLoading && !assistantReply ? (
            <View style={styles.assistantLoadingRow}>
              <ActivityIndicator />
              <Text style={{ color: colors.muted }}>Thinking about the listing...</Text>
            </View>
          ) : (
            <Text style={{ color: colors.text, lineHeight: 20 }}>
              {assistantReply || 'The assistant will summarize this book once the details load.'}
            </Text>
          )}

          <View style={styles.askRow}>
            <TextInput
              mode="outlined"
              style={[styles.askInput, { backgroundColor: colors.input }]}
              value={assistantQuestion}
              onChangeText={setAssistantQuestion}
              placeholder="Ask about condition, price, or fit"
              disabled={!book}
            />
            <Button
              mode="contained"
              buttonColor={colors.button}
              textColor={colors.buttonText}
              onPress={onAskAssistant}
              loading={assistantLoading}
              disabled={!book || !assistantQuestion.trim()}>
              Ask
            </Button>
          </View>
        </Card.Content>
      </Card>

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
        <TextInput
          mode="outlined"
          style={[styles.input, { backgroundColor: colors.input }]}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
        <Button
          mode="contained"
          buttonColor={colors.button}
          textColor={colors.buttonText}
          onPress={onSend}
          disabled={!text.trim()}>
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
  assistantCard: {
    margin: 12,
    borderWidth: 1,
  },
  assistantContent: {
    gap: 10,
  },
  assistantHeader: {
    gap: 4,
  },
  assistantLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  askRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  askInput: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 12,
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
