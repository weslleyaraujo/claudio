import React, { useCallback } from "react";
import { FormattedDate } from "react-intl";
import { StyleSheet, FlatList, ListRenderItem, Platform } from "react-native";
import { Post } from "../api/Entities";
import { useAppContext } from "../application/providers/AppProvider";
import { useEdgeSpacing, useTheme } from "../application/providers/Theming";
import { timestampToDate } from "../utils/timestamp-to-date";
import { ConditionalWrap } from "./ConditionalWrap";
import { Font } from "./Font";
import { Frame } from "./Frame";
import { PostTextContent } from "./PostTextContent";
import { UserAvatar } from "./UserAvatar";

const PostsList = React.forwardRef<
  FlatList<Post>,
  { data?: Post[]; isBehindTabBar?: boolean }
>(({ data, isBehindTabBar }, ref) => {
  const theme = useTheme();
  const { tabBarHeight } = useAppContext();
  const spacing = useEdgeSpacing();
  const keyExtractor = useCallback(({ id }: { id: string }) => String(id), []);
  const renderItem = useCallback<ListRenderItem<Post>>(
    ({ item, index }) => (
      <ConditionalWrap
        condition={Boolean(data && index === data.length - 1)}
        wrap={({ children }) => (
          <Frame
            key={String(item.id)}
            style={{
              paddingBottom: isBehindTabBar ? tabBarHeight : 0,
            }}
          >
            {children}
          </Frame>
        )}
      >
        <PostLine {...item} key={String(item.id)} />
      </ConditionalWrap>
    ),
    [data, isBehindTabBar, tabBarHeight]
  );

  if (!data?.length) {
    return null;
  }

  return (
    <FlatList<Post>
      ref={ref}
      removeClippedSubviews={Platform.OS === "ios"}
      ItemSeparatorComponent={null}
      scrollIndicatorInsets={{ right: 1 }}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: theme.units[spacing.vertical],
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

const PostLine = React.memo(function PostLine({ value, timestamp }: Post) {
  const spacing = useEdgeSpacing();
  const theme = useTheme();
  return (
    <Frame
      paddingBottom="smallest"
      paddingRight={spacing.horizontal}
      paddingLeft={spacing.horizontal}
      flexGrow={0}
      style={{
        paddingBottom: theme.units.medium,
        paddingTop: theme.units.medium,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.backgroundAccent,
      }}
    >
      <Frame
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        <Frame
          flexDirection="row"
          alignItems="flex-start"
          style={{
            height: "100%",
          }}
        >
          <UserAvatar />
        </Frame>
        <Frame flexGrow={1} flex={1} paddingLeft="small">
          <PostTextContent value={value} numberOfLines={3} />
        </Frame>
      </Frame>
      <Frame
        alignItems="flex-end"
        paddingTop="small"
        paddingLeft={spacing.horizontal}
      >
        <Font variant="caption" color="foregroundSecondary">
          <FormattedDate
            value={timestampToDate(timestamp)}
            dateStyle="short"
            month="short"
            day="2-digit"
          />
        </Font>
      </Frame>
    </Frame>
  );
});

export { PostsList };
