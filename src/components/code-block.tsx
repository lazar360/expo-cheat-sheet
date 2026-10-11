import { ScrollView, Text, View } from 'react-native';

export function CodeBlock({ children }: { children: string }) {
  return (
    <View className="rounded-lg bg-selected p-4 dark:bg-selected-dark">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text className="font-mono text-xs leading-[18px] text-black dark:text-white">
          {children.trim()}
        </Text>
      </ScrollView>
    </View>
  );
}
