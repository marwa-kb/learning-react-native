import { useState, useCallback } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getUserLikedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";

const Bookmark = () => {
	const { user } = useGlobalContext();
	const { data: posts, refetch } = useAppwrite(() => getUserLikedPosts(user.$id));
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [])
	);

	const onRefresh = () => {
		setRefreshing(true);
		refetch();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="bg-primary h-full">
			<FlatList
				data={posts}
				keyExtractor={(item) => item.$id}
				renderItem={({ item }) => (
					<VideoCard video={item}/>
				)}
				ListHeaderComponent={() => (
					<View className="my-6 px-4 space-y-6">
						<View className="justify-between items-start flex-row mb-6">
								<Text className="text-2xl font-psemibold text-white">Saved Videos</Text>
							<View className="mt-1.5">
								<Image
									source={images.logoSmall}
									className="w-6 h-10"
									resizeMode="contain"
								/>
							</View>
						</View>

						<SearchInput placeholder="Search your saved videos" searchType="liked" />

					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="Browse videos to find your favorites!"
					/>
				)}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			/>

			<StatusBar backgroundColor="#161622" style="light" />
		</SafeAreaView>
	);
};

export default Bookmark;