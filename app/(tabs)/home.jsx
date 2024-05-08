import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import { images } from "../../constants";
import { StatusBar } from "expo-status-bar";
import EmptyState from "../../components/EmptyState";
import { useState, useEffect } from "react";
import { getAllPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
	const { data: posts, refetch } = useAppwrite(getAllPosts);
	const [refreshing, setRefreshing] = useState(false);

	const onFrefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}

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
							<View>
								<Text className="font-pmedium text-sm text-gray-100">Welcome back</Text>
								<Text className="text-2xl font-psemibold text-white">mimi</Text>
							</View>
							<View className="mt-1.5">
								<Image
									source={images.logoSmall}
									className="w-6 h-10"
									resizeMode="contain"
								/>
							</View>
						</View>

						<SearchInput />

						<View className="w-full flex-1 pt-5 pb-8">
							<Text className="text-gray-100 text-lg font-pregular mb-3">
								Latest Videos
							</Text>
							<Trending posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []} />
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title="No Videos Found"
						subtitle="Be the first one to upload a video"
					/>
				)}
				refreshControl={<RefreshControl refreshing={refreshing} onFrefresh={onFrefresh} />}
			/>

			<StatusBar backgroundColor="#161622" style="light" />
		</SafeAreaView>
	);
};

export default Home;
